import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';
import { generateMembershipBadgeImage, CardTemplateConfig } from '@/lib/card-generator';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await enforceAuth(req, 'canApproveMembers');
  if (auth instanceof NextResponse) return auth;

  try {
    const member = await prisma.member.findUnique({
      where: { id },
      include: { tier: true },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Fetch custom tier card template if exists
    const templateRecord = await prisma.cardTemplate.findFirst({
      where: { tierId: member.tierId, isActive: true },
    });

    const templateConfig: CardTemplateConfig | undefined = templateRecord
      ? {
          width: templateRecord.width,
          height: templateRecord.height,
          aspectRatio: templateRecord.aspectRatio,
          baseDesignUrl: templateRecord.baseDesignUrl || undefined,
          elements: (templateRecord.layoutConfig as any) || [],
        }
      : undefined;

    // Generate high-resolution digital membership badge
    const badgeUrl = await generateMembershipBadgeImage({
      member: {
        membershipCode: member.membershipCode,
        fullName: member.fullName,
        photoUrl: member.photoUrl,
        tierName: member.tier.name,
        approvedAt: new Date(),
      },
      templateConfig,
    });

    const updated = await prisma.member.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        rejectionReason: null,
        generatedBadgeUrl: badgeUrl,
        badgeGeneratedAt: new Date(),
      },
      include: { tier: true },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'MEMBER_APPROVED',
      entityType: 'Member',
      entityId: id,
      oldValue: { status: member.status },
      newValue: { status: 'APPROVED', badgeUrl },
      req,
    });

    return NextResponse.json({
      success: true,
      message: `Member ${member.membershipCode} approved and badge generated.`,
      member: updated,
    });
  } catch (error: any) {
    console.error('Approval error:', error);
    return NextResponse.json({ error: error.message || 'Failed to approve member' }, { status: 500 });
  }
}
