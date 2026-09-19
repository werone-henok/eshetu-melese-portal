import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateMembershipBadgeImage, CardTemplateConfig } from '@/lib/card-generator';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    if (!code) {
      return NextResponse.json({ error: 'Membership code required' }, { status: 400 });
    }

    const member = await prisma.member.findUnique({
      where: { membershipCode: code },
      include: {
        tier: {
          include: {
            cardTemplates: {
              where: { isActive: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member pass not found' }, { status: 404 });
    }

    let badgeUrl = member.generatedBadgeUrl;

    const forceRegenerate =
      req.nextUrl.searchParams.get('regenerate') === 'true' ||
      req.nextUrl.searchParams.get('fresh') === 'true' ||
      !member.badgeGeneratedAt ||
      new Date(member.badgeGeneratedAt).getTime() < new Date('2026-09-20T00:00:00Z').getTime();

    // If already generated, file exists, and not forcing regeneration, serve directly
    if (!forceRegenerate && badgeUrl && badgeUrl.startsWith('/uploads/')) {
      const localFilePath = path.join(process.cwd(), 'public', badgeUrl.replace(/^\//, ''));
      if (fs.existsSync(localFilePath)) {
        const fileBuffer = await fs.promises.readFile(localFilePath);
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="Eshetu-Melese-Card-${member.membershipCode}.png"`,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    // Generate badge dynamically
    const templateRecord =
      member.tier?.cardTemplates?.[0] ||
      (await prisma.cardTemplate.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
      }));

    const templateConfig: CardTemplateConfig | undefined = templateRecord
      ? {
          width: templateRecord.width,
          height: templateRecord.height,
          aspectRatio: templateRecord.aspectRatio,
          baseDesignUrl: templateRecord.baseDesignUrl || undefined,
          elements: (templateRecord.layoutConfig as any) || [],
        }
      : undefined;

    const origin = req.nextUrl.origin;
    badgeUrl = await generateMembershipBadgeImage({
      member: {
        membershipCode: member.membershipCode,
        fullName: member.fullName,
        photoUrl: member.photoUrl,
        tierName: member.tier?.name || 'MEMBER',
        approvedAt: member.approvedAt || member.createdAt,
      },
      templateConfig,
      siteUrl: origin,
    });

    // Save generated badge URL in DB for instant future downloads
    await prisma.member.update({
      where: { id: member.id },
      data: {
        generatedBadgeUrl: badgeUrl,
        badgeGeneratedAt: new Date(),
      },
    });

    const localFilePath = path.join(process.cwd(), 'public', badgeUrl.replace(/^\//, ''));
    const fileBuffer = await fs.promises.readFile(localFilePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="Eshetu-Melese-Card-${member.membershipCode}.png"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Card download error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate download' }, { status: 500 });
  }
}
