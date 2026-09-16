import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';
import { DEFAULT_CARD_TEMPLATE } from '@/lib/card-generator';

// GET all card templates or for specific tier
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tierId = searchParams.get('tierId');

    const where: any = {};
    if (tierId) where.tierId = tierId;

    const templates = await prisma.cardTemplate.findMany({
      where,
      include: { tier: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      templates,
      defaultTemplate: DEFAULT_CARD_TEMPLATE,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch templates' }, { status: 500 });
  }
}

// POST or PUT upsert card template for tier
export async function POST(req: NextRequest) {
  const auth = await enforceAuth(req, 'canEditCardDesign');
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { tierId, name, baseDesignUrl, width, height, aspectRatio, layoutConfig } = body;

    if (!tierId) {
      return NextResponse.json({ error: 'tierId is required' }, { status: 400 });
    }

    const existing = await prisma.cardTemplate.findFirst({ where: { tierId } });

    let template;
    if (existing) {
      template = await prisma.cardTemplate.update({
        where: { id: existing.id },
        data: {
          name: name || existing.name,
          baseDesignUrl: baseDesignUrl !== undefined ? baseDesignUrl : existing.baseDesignUrl,
          width: width ? parseInt(width) : existing.width,
          height: height ? parseInt(height) : existing.height,
          aspectRatio: aspectRatio || existing.aspectRatio,
          layoutConfig: layoutConfig || existing.layoutConfig,
        },
      });
    } else {
      template = await prisma.cardTemplate.create({
        data: {
          tierId,
          name: name || 'Custom Tier Template',
          baseDesignUrl,
          width: width ? parseInt(width) : 1050,
          height: height ? parseInt(height) : 600,
          aspectRatio: aspectRatio || '85.60:53.98',
          layoutConfig: layoutConfig || DEFAULT_CARD_TEMPLATE.elements,
        },
      });
    }

    await createAuditLog({
      userId: auth.user.userId,
      action: 'CARD_TEMPLATE_SAVED',
      entityType: 'CardTemplate',
      entityId: template.id,
      newValue: template,
      req,
    });

    return NextResponse.json({ success: true, template });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save card template' }, { status: 500 });
  }
}
