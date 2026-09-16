import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await enforceAuth(req, 'canEditPricing');
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const oldTier = await prisma.tier.findUnique({ where: { id } });
    if (!oldTier) {
      return NextResponse.json({ error: 'Tier not found' }, { status: 404 });
    }

    const updated = await prisma.tier.update({
      where: { id },
      data: {
        name: body.name ?? oldTier.name,
        priceEtb: body.priceEtb !== undefined ? parseFloat(body.priceEtb) : oldTier.priceEtb,
        priceUsd: body.priceUsd !== undefined ? parseFloat(body.priceUsd) : oldTier.priceUsd,
        description: body.description ?? oldTier.description,
        perks: body.perks ?? oldTier.perks,
        badgeColor: body.badgeColor ?? oldTier.badgeColor,
        templateImageUrl: body.templateImageUrl ?? oldTier.templateImageUrl,
        layoutConfig: body.layoutConfig ?? oldTier.layoutConfig,
        aspectRatio: body.aspectRatio ?? oldTier.aspectRatio,
        displayOrder: body.displayOrder !== undefined ? parseInt(body.displayOrder) : oldTier.displayOrder,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : oldTier.isActive,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : oldTier.isFeatured,
        ctaText: body.ctaText ?? oldTier.ctaText,
      },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'TIER_UPDATED',
      entityType: 'Tier',
      entityId: id,
      oldValue: oldTier,
      newValue: updated,
      req,
    });

    return NextResponse.json({ success: true, tier: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update tier' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await enforceAuth(req, 'canManageTiers');
  if (auth instanceof NextResponse) return auth;

  try {
    const deleted = await prisma.tier.delete({ where: { id } });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'TIER_DELETED',
      entityType: 'Tier',
      entityId: id,
      oldValue: deleted,
      req,
    });

    return NextResponse.json({ success: true, message: 'Tier deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete tier' }, { status: 500 });
  }
}
