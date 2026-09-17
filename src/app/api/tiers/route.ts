import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';

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
    return NextResponse.json({ error: error.message || 'Failed to fetch tiers' }, { status: 500 });
  }
}

// POST create new tier (Admin/Editor only)
export async function POST(req: NextRequest) {
  const auth = await enforceAuth(req, 'canManageTiers');
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { name, priceEtb, priceUsd, description, perks, badgeColor, displayOrder, isFeatured, ctaText } = body;

    if (!name || priceEtb === undefined) {
      return NextResponse.json({ error: 'Tier name and price in ETB are required' }, { status: 400 });
    }

    const tier = await prisma.tier.create({
      data: {
        name,
        priceEtb: parseFloat(priceEtb),
        priceUsd: priceUsd ? parseFloat(priceUsd) : 0,
        description: description || '',
        perks: perks || [],
        badgeColor: badgeColor || '#D4AF37',
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        isFeatured: Boolean(isFeatured),
        ctaText: ctaText || 'Register for Tier',
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
    return NextResponse.json({ error: error.message || 'Failed to create tier' }, { status: 500 });
  }
}
