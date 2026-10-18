import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCertificateTemplate } from '@/lib/certificate-service';
import { generateCertificateBuffer } from '@/lib/certificate-generator';

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
      include: { tier: true },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const template = await getCertificateTemplate();
    const origin = req.nextUrl.origin;

    const buffer = await generateCertificateBuffer({
      member: {
        membershipCode: member.membershipCode,
        fullName: member.fullName,
        photoUrl: member.photoUrl,
        tierName: member.tier?.name || 'Member',
        approvedAt: member.approvedAt || member.createdAt,
      },
      template,
      siteUrl: origin,
    });

    return new NextResponse(buffer as any, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="DonkeyTube-Certificate-${member.membershipCode}.png"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Certificate download error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate certificate download' },
      { status: 500 }
    );
  }
}
