import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, signToken, createAuditLog } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@eshetumelese.com').toLowerCase().trim();
    const envAdminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword2026!';

    // Emergency Master Recovery: If logging in with the official admin credentials from .env
    const isMasterRecovery =
      email.toLowerCase().trim() === envAdminEmail && password === envAdminPassword;

    if (!user && isMasterRecovery) {
      // Auto-create admin user if not present
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash(envAdminPassword, 10);
      user = await prisma.user.create({
        data: {
          email: envAdminEmail,
          name: 'Super Admin',
          passwordHash: hash,
          role: 'ADMIN',
          isActive: true,
        },
      });
    }

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Invalid credentials or inactive account.' }, { status: 401 });
    }

    let valid = false;
    if (isMasterRecovery) {
      valid = true;
      // Auto-sync password hash in database so future logins remain aligned
      const bcrypt = require('bcryptjs');
      const updatedHash = await bcrypt.hash(envAdminPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: updatedHash, role: 'ADMIN', isActive: true },
      });
    } else {
      valid = await verifyPassword(password, user.passwordHash);
    }

    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await createAuditLog({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      req,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set secure cookie
    response.cookies.set('eshetu_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
