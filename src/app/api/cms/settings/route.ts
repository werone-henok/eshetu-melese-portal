import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';
import { BrandingSettingsSchema } from '@/lib/validations';

const DEFAULT_BRANDING = {
  siteName: 'ESHETU MELESE',
  siteNameAm: 'እሸቱ መለሰ',
  tagline: 'Official Member Portal',
  taglineAm: 'ይፋዊ የአባላት ፖርታል',
  logoUrl: '',
  faviconUrl: '',
  paymentInstructions: 'Please deposit the membership fee via Commercial Bank of Ethiopia (CBE): 1000234567890 (Eshetu Melese) or Telebirr: 0911234567. Then upload your deposit receipt or transfer screenshot below.',
  paymentInstructionsAm: 'እባክዎ የአባልነት መዋጮ ክፍያዎን በኢትዮጵያ ንግድ ባንክ (CBE) ሂሳብ ቁጥር፡ 1000234567890 (እሸቱ መለሰ) ወይም በቴሌብር (Telebirr) ቁጥር፡ 0911234567 ገቢ ያድርጉ። በመቀጠል የደረሰኙን ስክሪንሾት ወይም ፎቶ ከዚህ በታች ያያይዙ።',
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
      return NextResponse.json(
        {
          success: true,
          branding: { ...DEFAULT_BRANDING, ...parsed },
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        }
      );
    } catch {
      return NextResponse.json(
        { success: true, branding: DEFAULT_BRANDING },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        }
      );
    }
  } catch (error: any) {
    console.error('Error in GET /api/cms/settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site branding' },
      { status: 500 }
    );
  }
}

// PUT update branding (Admin / Editor)
export async function PUT(req: NextRequest) {
  const auth = await enforceAuth(req, 'canEditCms');
  if (auth instanceof NextResponse) return auth;

  try {
    const rawBody = await req.json();
    const parsed = BrandingSettingsSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid branding settings', details: parsed.error.issues.map(i => i.message) },
        { status: 400 }
      );
    }

    const {
      siteName,
      siteNameAm,
      tagline,
      taglineAm,
      logoUrl,
      faviconUrl,
      paymentInstructions,
      paymentInstructionsAm,
    } = parsed.data;

    const newBranding = {
      siteName: siteName?.trim() || DEFAULT_BRANDING.siteName,
      siteNameAm: siteNameAm?.trim() || DEFAULT_BRANDING.siteNameAm,
      tagline: tagline?.trim() || DEFAULT_BRANDING.tagline,
      taglineAm: taglineAm?.trim() || DEFAULT_BRANDING.taglineAm,
      logoUrl: logoUrl !== undefined ? logoUrl : '',
      faviconUrl: faviconUrl !== undefined ? faviconUrl : '',
      paymentInstructions: paymentInstructions !== undefined ? paymentInstructions : DEFAULT_BRANDING.paymentInstructions,
      paymentInstructionsAm: paymentInstructionsAm !== undefined ? paymentInstructionsAm : DEFAULT_BRANDING.paymentInstructionsAm,
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
    console.error('Error in PUT /api/cms/settings:', error);
    return NextResponse.json(
      { error: 'Failed to update branding settings' },
      { status: 500 }
    );
  }
}
