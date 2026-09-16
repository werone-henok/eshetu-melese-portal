import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEFAULT_CARD_TEMPLATE } from '@/lib/card-types';

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch public approved members (non-deleted)
    const members = await prisma.member.findMany({
      where: {
        isDeleted: false,
        status: 'APPROVED',
      },
      select: {
        id: true,
        membershipCode: true,
        fullName: true,
        country: true,
        photoUrl: true,
        generatedBadgeUrl: true,
        createdAt: true,
        approvedAt: true,
        tier: {
          select: {
            id: true,
            name: true,
            badgeColor: true,
            layoutConfig: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // 2. Fetch all active card templates designed in Card Studio
    const templates = await prisma.cardTemplate.findMany({
      where: { isActive: true },
      include: {
        tier: {
          select: {
            id: true,
            name: true,
            badgeColor: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      members,
      templates,
      defaultTemplate: DEFAULT_CARD_TEMPLATE,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch public showcase cards' },
      { status: 500 }
    );
  }
}
