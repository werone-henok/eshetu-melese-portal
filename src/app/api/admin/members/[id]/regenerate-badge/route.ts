import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';
import { generateMembershipBadgeImage, CardTemplateConfig } from '@/lib/card-generator';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await enforceAuth(req, 'canGenerateBadges');
  if (auth instanceof NextResponse) return auth;

  try {
    const member = await prisma.member.findUnique({
      where: { id },
      include: { tier: true },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

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

    const badgeUrl = await generateMembershipBadgeImage({
      member: {
        membershipCode: member.membershipCode,
        fullName: member.fullName,
        photoUrl: member.photoUrl,
        tierName: member.tier.name,
        approvedAt: member.approvedAt || new Date(),
      },
      templateConfig,
    });

    const updated = await prisma.member.update({
      where: { id },
      data: {
        generatedBadgeUrl: badgeUrl,
        badgeGeneratedAt: new Date(),
      },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'BADGE_REGENERATED',
      entityType: 'Member',
      entityId: id,
      newValue: { badgeUrl },
      req,
    });

    return NextResponse.json({
      success: true,
      message: 'Badge regenerated successfully.',
      badgeUrl,
      member: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to regenerate badge' }, { status: 500 });
  }
}
