import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';

// GET all themes or active theme
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';

    if (activeOnly) {
      const activeTheme = await prisma.theme.findFirst({ where: { isActive: true } });
      return NextResponse.json({ success: true, theme: activeTheme });
    }

    const themes = await prisma.theme.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, themes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch themes' }, { status: 500 });
  }
}

// POST create theme preset
export async function POST(req: NextRequest) {
  const auth = await enforceAuth(req, 'canManageThemes');
  if (auth instanceof NextResponse) return auth;

  try {
    const { name, configuration, isActive } = await req.json();

    if (isActive) {
      await prisma.theme.updateMany({ data: { isActive: false } });
    }

    const theme = await prisma.theme.upsert({
      where: { name },
      update: {
        configuration,
        isActive: Boolean(isActive),
      },
      create: {
        name,
        configuration,
        isActive: Boolean(isActive),
      },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'THEME_SAVED',
      entityType: 'Theme',
      entityId: theme.id,
      newValue: theme,
      req,
    });

    return NextResponse.json({ success: true, theme });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create theme' }, { status: 500 });
  }
}

// PUT activate a theme
export async function PUT(req: NextRequest) {
  const auth = await enforceAuth(req, 'canManageThemes');
  if (auth instanceof NextResponse) return auth;

  try {
    const { id, configuration, name } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 });
    }

    // Set all other themes inactive
    await prisma.theme.updateMany({ data: { isActive: false } });

    const updated = await prisma.theme.update({
      where: { id },
      data: {
        isActive: true,
        ...(configuration ? { configuration } : {}),
        ...(name ? { name } : {}),
      },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'THEME_ACTIVATED',
      entityType: 'Theme',
      entityId: id,
      newValue: updated,
      req,
    });

    return NextResponse.json({ success: true, theme: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to activate theme' }, { status: 500 });
  }
}
