import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';
import { TierCreateSchema } from '@/lib/validations';

// GET all tiers (Public / Admin)
export async function GET() {
  try {
    const tiers = await prisma.tier.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { members: { where: { isDeleted: false, status: 'APPROVED' } } },
        },
      },
    });

    return NextResponse.json(
      { success: true, tiers },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in GET /api/tiers:', error);
    return NextResponse.json({ error: 'Failed to fetch tiers' }, { status: 500 });
  }
}

// POST create new tier (Admin/Editor only)
export async function POST(req: NextRequest) {
  const auth = await enforceAuth(req, 'canManageTiers');
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const validation = TierCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid tier configuration', details: validation.error.issues.map(e => e.message) },
        { status: 400 }
      );
    }

    const { name, priceEtb, priceUsd, description, perks, badgeColor, displayOrder, isFeatured, ctaText } = validation.data;

    const tier = await prisma.tier.create({
      data: {
        name,
        priceEtb,
        priceUsd,
        description,
        perks,
        badgeColor,
        displayOrder,
        isFeatured,
        ctaText,
      },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'TIER_CREATED',
      entityType: 'Tier',
      entityId: tier.id,
      newValue: tier,
      req,
    });

    return NextResponse.json({ success: true, tier });
  } catch (error: any) {
    console.error('Tier Creation Error:', error);
    return NextResponse.json({ error: 'Failed to create tier' }, { status: 500 });
  }
}
