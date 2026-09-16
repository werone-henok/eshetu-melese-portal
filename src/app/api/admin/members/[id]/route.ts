import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';

// PUT Update Member (Admin & Editor)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await enforceAuth(req, 'canEditMembers');
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const body = await req.json();
    const { fullName, phoneNumber, email, tierId, status, paymentMethod, paymentReference, photoUrl } = body;

    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const normalizedPhone = phoneNumber
      ? phoneNumber.trim().replace(/[^\d+]/g, '')
      : existing.normalizedPhone;

    const updated = await prisma.member.update({
      where: { id },
      data: {
        fullName: fullName ?? existing.fullName,
        phoneNumber: phoneNumber ?? existing.phoneNumber,
        normalizedPhone,
        email: email !== undefined ? email : existing.email,
        tierId: tierId ?? existing.tierId,
        status: status ?? existing.status,
        paymentMethod: paymentMethod ?? existing.paymentMethod,
        paymentReference: paymentReference ?? existing.paymentReference,
        photoUrl: photoUrl !== undefined ? photoUrl : existing.photoUrl,
        updatedAt: new Date(),
      },
      include: { tier: true },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'MEMBER_UPDATED',
      entityType: 'Member',
      entityId: id,
      oldValue: existing,
      newValue: updated,
      req,
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update member' }, { status: 500 });
  }
}

// DELETE Member (Soft delete or permanent removal, Admin & Editor)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await enforceAuth(req, 'canDeleteMembers');
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;

    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Soft delete to maintain audit safety
    const deleted = await prisma.member.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: auth.user.email,
      },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'MEMBER_DELETED',
      entityType: 'Member',
      entityId: id,
      oldValue: existing,
      newValue: { isDeleted: true },
      req,
    });

    return NextResponse.json({ success: true, message: 'Member removed successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete member' }, { status: 500 });
  }
}
