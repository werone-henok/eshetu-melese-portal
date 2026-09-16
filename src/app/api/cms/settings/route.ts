import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';

export const DEFAULT_BRANDING = {
  siteName: 'ESHETU MELESE',
  siteNameAm: 'እሸቱ መለሰ',
  tagline: 'Official Member Portal',
  taglineAm: 'ይፋዊ የአባላት ፖርታል',
  logoUrl: '',
  faviconUrl: '',
};

// GET current branding (Public)
export async function GET() {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { key: 'site.branding' },
    });

    if (!record || !record.value) {
      return NextResponse.json({ success: true, branding: DEFAULT_BRANDING });
    }

    try {
      const parsed = JSON.parse(record.value);
      return NextResponse.json({
        success: true,
        branding: { ...DEFAULT_BRANDING, ...parsed },
      });
    } catch {
      return NextResponse.json({ success: true, branding: DEFAULT_BRANDING });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch site branding' },
      { status: 500 }
    );
  }
}

// PUT update branding (Admin / Editor)
export async function PUT(req: NextRequest) {
  const auth = await enforceAuth(req, 'canEditCms');
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { siteName, siteNameAm, tagline, taglineAm, logoUrl, faviconUrl } = body;

    const newBranding = {
      siteName: siteName?.trim() || DEFAULT_BRANDING.siteName,
      siteNameAm: siteNameAm?.trim() || DEFAULT_BRANDING.siteNameAm,
      tagline: tagline?.trim() || DEFAULT_BRANDING.tagline,
      taglineAm: taglineAm?.trim() || DEFAULT_BRANDING.taglineAm,
      logoUrl: logoUrl !== undefined ? logoUrl : '',
      faviconUrl: faviconUrl !== undefined ? faviconUrl : '',
    };

    const record = await prisma.siteContent.upsert({
      where: { key: 'site.branding' },
      update: {
        value: JSON.stringify(newBranding),
        updatedBy: auth.user.userId,
      },
      create: {
        key: 'site.branding',
        value: JSON.stringify(newBranding),
        section: 'global',
        contentType: 'json',
        page: 'global',
        updatedBy: auth.user.userId,
      },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'BRANDING_UPDATED',
      entityType: 'SiteContent',
      entityId: record.id,
      newValue: newBranding,
      req,
    });

    return NextResponse.json({
      success: true,
      message: 'Website branding updated successfully',
      branding: newBranding,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update branding settings' },
      { status: 500 }
    );
  }
}
