import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';

// GET members with filters and pagination (Admin, Editor, Viewer)
export async function GET(req: NextRequest) {
  const auth = await enforceAuth(req, 'canViewMembers');
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const tierId = searchParams.get('tierId');
    const search = searchParams.get('search')?.trim();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = { isDeleted: false };
    if (status && status !== 'ALL') where.status = status;
    if (tierId && tierId !== 'ALL') where.tierId = tierId;
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { normalizedPhone: { contains: search } },
        { membershipCode: { contains: search } },
        { paymentReference: { contains: search } },
      ];
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.member.count({ where }),
    ]);

    // Also get KPI counts
    const [pendingCount, approvedCount, rejectedCount, suspendedCount] = await Promise.all([
      prisma.member.count({ where: { status: 'PENDING', isDeleted: false } }),
      prisma.member.count({ where: { status: 'APPROVED', isDeleted: false } }),
      prisma.member.count({ where: { status: 'REJECTED', isDeleted: false } }),
      prisma.member.count({ where: { status: 'SUSPENDED', isDeleted: false } }),
    ]);

    return NextResponse.json({
      success: true,
      members,
      total,
      page,
      limit,
      kpis: {
        total: pendingCount + approvedCount + rejectedCount + suspendedCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        suspended: suspendedCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch members' }, { status: 500 });
  }
}
