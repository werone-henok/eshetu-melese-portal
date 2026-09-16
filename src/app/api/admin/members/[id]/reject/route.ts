import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await enforceAuth(req, 'canRejectMembers');
  if (auth instanceof NextResponse) return auth;

  try {
    const { reason } = await req.json();
    const member = await prisma.member.findUnique({ where: { id } });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const updated = await prisma.member.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason || 'Payment could not be verified or invalid details provided.',
      },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'MEMBER_REJECTED',
      entityType: 'Member',
      entityId: id,
      oldValue: { status: member.status },
      newValue: { status: 'REJECTED', reason },
      req,
    });

    return NextResponse.json({ success: true, message: 'Member rejected.', member: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to reject member' }, { status: 500 });
  }
}
