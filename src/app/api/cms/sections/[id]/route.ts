import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await enforceAuth(req, 'canEditCms');
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const oldSection = await prisma.siteSection.findUnique({ where: { id } });
    if (!oldSection) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    const updated = await prisma.siteSection.update({
      where: { id },
      data: {
        title: body.title ?? oldSection.title,
        configuration: body.configuration ?? oldSection.configuration,
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : oldSection.isVisible,
        displayOrder: body.displayOrder !== undefined ? parseInt(body.displayOrder) : oldSection.displayOrder,
      },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'SECTION_UPDATED',
      entityType: 'SiteSection',
      entityId: id,
      oldValue: oldSection,
      newValue: updated,
      req,
    });

    return NextResponse.json({ success: true, section: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update section' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await enforceAuth(req, 'canEditCms');
  if (auth instanceof NextResponse) return auth;

  try {
    const deleted = await prisma.siteSection.delete({ where: { id } });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'SECTION_DELETED',
      entityType: 'SiteSection',
      entityId: id,
      oldValue: deleted,
      req,
    });

    return NextResponse.json({ success: true, message: 'Section deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete section' }, { status: 500 });
  }
}
