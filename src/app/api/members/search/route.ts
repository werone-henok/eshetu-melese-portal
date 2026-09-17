import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { normalizePhoneNumber } from '@/lib/countries';
import { checkRateLimit } from '@/lib/rate-limit';
import { MemberSearchSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  // 1. IP Rate Limiting: 60 search requests per minute per IP
  const rateLimitResponse = checkRateLimit(req, 'members:search', 60, 60000);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get('q') || '';

    const validation = MemberSearchSchema.safeParse({ q: rawQuery });
    if (!validation.success) {
      return NextResponse.json({ error: 'Search query is too long.' }, { status: 400 });
    }

    const query = validation.data.q.trim();
    let members;

    if (!query) {
      // If no search query, return list of approved members for the gallery
      members = await prisma.member.findMany({
        where: {
          isDeleted: false,
          status: 'APPROVED',
        },
        include: {
          tier: {
            include: {
              cardTemplates: {
                where: { isActive: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    } else {
      // 1. Direct code search
      members = await prisma.member.findMany({
        where: {
          membershipCode: query,
          isDeleted: false,
          status: 'APPROVED',
        },
        include: {
          tier: {
            include: {
              cardTemplates: {
                where: { isActive: true },
                take: 1,
              },
            },
          },
        },
      });

      // 2. Search by Name, Phone, Email, or Code
      if (members.length === 0) {
        const normalizedQuery = query.replace(/\s+/g, '');
        members = await prisma.member.findMany({
          where: {
            OR: [
              { fullName: { contains: query } },
              { email: { contains: query } },
              { phoneNumber: { contains: query } },
              { normalizedPhone: { contains: normalizedQuery } },
              { membershipCode: { contains: query } },
            ],
            isDeleted: false,
            status: 'APPROVED',
          },
          include: {
            tier: {
              include: {
                cardTemplates: {
                  where: { isActive: true },
                  take: 1,
                },
              },
            },
          },
          take: 50,
        });
      }
    }

    // Also fetch default active template fallback if specific tier template doesn't exist
    const defaultTemplate = await prisma.cardTemplate.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });

    const safeResults = members.map((m: any) => {
      const activeTemplate = m.tier?.cardTemplates?.[0] || defaultTemplate || null;

      return {
        membershipCode: m.membershipCode,
        fullName: m.fullName,
        country: m.country,
        tierName: m.tier.name,
        badgeColor: m.tier.badgeColor,
        photoUrl: m.photoUrl,
        generatedBadgeUrl: m.generatedBadgeUrl,
        approvedAt: m.approvedAt,
        template: activeTemplate
          ? {
              width: activeTemplate.width,
              height: activeTemplate.height,
              aspectRatio: activeTemplate.aspectRatio,
              baseDesignUrl: activeTemplate.baseDesignUrl,
              layoutConfig: activeTemplate.layoutConfig,
            }
          : null,
      };
    });

    return NextResponse.json(
      { success: true, results: safeResults },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Search failed.' }, { status: 500 });
  }
}
