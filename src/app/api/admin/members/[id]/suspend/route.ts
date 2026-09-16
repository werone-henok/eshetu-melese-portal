import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await enforceAuth(req, 'canSuspendMembers');
  if (auth instanceof NextResponse) return auth;

  try {
    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const nextStatus = member.status === 'SUSPENDED' ? 'APPROVED' : 'SUSPENDED';
    const updated = await prisma.member.update({
      where: { id },
      data: { status: nextStatus },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: nextStatus === 'SUSPENDED' ? 'MEMBER_SUSPENDED' : 'MEMBER_REACTIVATED',
      entityType: 'Member',
      entityId: id,
      oldValue: { status: member.status },
      newValue: { status: nextStatus },
      req,
    });

    return NextResponse.json({
      success: true,
      message: `Member status toggled to ${nextStatus}`,
      member: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to toggle status' }, { status: 500 });
  }
}
