import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, hashPassword, createAuditLog } from '@/lib/auth';
import { UserCreateSchema, UserUpdateSchema } from '@/lib/validations';

// GET all users and roles (Admin only)
export async function GET(req: NextRequest) {
  const auth = await enforceAuth(req, 'canManageUsers');
  if (auth instanceof NextResponse) return auth;

  try {
    const [users, roles] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastLogin: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.role.findMany({
        orderBy: { name: 'asc' },
      }),
    ]);

    return NextResponse.json({ success: true, users, roles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch users' }, { status: 500 });
  }
}

// POST create new user (Admin only)
export async function POST(req: NextRequest) {
  const auth = await enforceAuth(req, 'canManageUsers');
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const validation = UserCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid user parameters', details: validation.error.issues.map(i => i.message) },
        { status: 400 }
      );
    }

    const { email, name, password, role, isActive } = validation.data;

    // Check duplicate email
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: 'A user with this email address already exists.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        passwordHash,
        role: role || 'VIEWER',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'USER_CREATED',
      entityType: 'User',
      entityId: user.id,
      newValue: { email: user.email, role: user.role },
      req,
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}

// PUT update user or role (Admin only)
export async function PUT(req: NextRequest) {
  const auth = await enforceAuth(req, 'canManageUsers');
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
    }

    const validation = UserUpdateSchema.safeParse(updateFields);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid user update fields', details: validation.error.issues.map(i => i.message) },
        { status: 400 }
      );
    }

    const { name, role, isActive, password } = validation.data;
    const data: any = {};
    if (name) data.name = name;
    if (role) data.role = role;
    if (isActive !== undefined) data.isActive = isActive;
    if (password) data.passwordHash = await hashPassword(password);

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'USER_UPDATED',
      entityType: 'User',
      entityId: id,
      newValue: { name, role, isActive },
      req,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    console.error('User Update Error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE user (Admin only)
export async function DELETE(req: NextRequest) {
  const auth = await enforceAuth(req, 'canManageUsers');
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent deleting oneself
    if (auth.user.userId === id) {
      return NextResponse.json({ error: 'You cannot delete your own account while logged in.' }, { status: 400 });
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Safely uncouple references (AuditLog userId to null, SiteContent updatedBy to null)
    await prisma.auditLog.updateMany({
      where: { userId: id },
      data: { userId: null },
    });

    await prisma.siteContent.updateMany({
      where: { updatedBy: id },
      data: { updatedBy: null },
    });

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'USER_DELETED',
      entityType: 'User',
      entityId: id,
      oldValue: { email: userToDelete.email, name: userToDelete.name, role: userToDelete.role },
      req,
    });

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('User Deletion Error:', error);
    return NextResponse.json({ error: 'Failed to delete user safely.' }, { status: 500 });
  }
}
