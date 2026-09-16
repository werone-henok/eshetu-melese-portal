import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';

// GET all website sections (Public or Admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeHidden = searchParams.get('all') === 'true';

    const where: any = { page: 'home' };
    if (!includeHidden) {
      where.isVisible = true;
    }

    const sections = await prisma.siteSection.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ success: true, sections });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch sections' }, { status: 500 });
  }
}

// POST create new section (Admin / Editor)
export async function POST(req: NextRequest) {
  const auth = await enforceAuth(req, 'canRearrangeSections');
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { sectionType, title, configuration, displayOrder, isVisible } = body;

    const count = await prisma.siteSection.count();
    const section = await prisma.siteSection.create({
      data: {
        page: 'home',
        sectionType: sectionType || 'custom',
        title: title || 'New Section',
        configuration: configuration || {},
        displayOrder: displayOrder !== undefined ? displayOrder : count + 1,
        isVisible: isVisible !== undefined ? isVisible : true,
      },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'SECTION_CREATED',
      entityType: 'SiteSection',
      entityId: section.id,
      newValue: section,
      req,
    });

    return NextResponse.json({ success: true, section });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create section' }, { status: 500 });
  }
}

// PUT batch reorder sections (Admin / Editor)
export async function PUT(req: NextRequest) {
  const auth = await enforceAuth(req, 'canRearrangeSections');
  if (auth instanceof NextResponse) return auth;

  try {
    const { orderedIds } = await req.json(); // Array of { id: string, displayOrder: number, isVisible?: boolean }

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds must be an array' }, { status: 400 });
    }

    const updates = orderedIds.map((item, index) =>
      prisma.siteSection.update({
        where: { id: item.id },
        data: {
          displayOrder: item.displayOrder !== undefined ? item.displayOrder : index + 1,
          ...(item.isVisible !== undefined ? { isVisible: item.isVisible } : {}),
        },
      })
    );

    await prisma.$transaction(updates);

    await createAuditLog({
      userId: auth.user.userId,
      action: 'SECTIONS_REORDERED',
      entityType: 'SiteSection',
      newValue: { count: orderedIds.length },
      req,
    });

    return NextResponse.json({ success: true, message: 'Section order updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to reorder sections' }, { status: 500 });
  }
}
