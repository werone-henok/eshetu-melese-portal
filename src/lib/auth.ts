import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'eshetu_jwt_super_secret_fallback_key_2026';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(req: NextRequest): Promise<TokenPayload | null> {
  const authHeader = req.headers.get('authorization');
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Check cookie fallback
    const cookieToken = req.cookies.get('eshetu_auth_token')?.value;
    if (cookieToken) token = cookieToken;
  }

  if (!token) return null;
  return verifyToken(token);
}

export const PERMISSION_MATRIX = {
  ADMIN: {
    canViewMembers: true,
    canAddMembers: true,
    canEditMembers: true,
    canApproveMembers: true,
    canRejectMembers: true,
    canSuspendMembers: true,
    canDeleteMembers: true,
    canEditCms: true,
    canRearrangeSections: true,
    canEditPricing: true,
    canManageTiers: true,
    canEditCardDesign: true,
    canGenerateBadges: true,
    canExportData: true,
    canImportMembers: true,
    canSyncNotion: true,
    canManageUsers: true,
    canManageRoles: true,
    canManageThemes: true,
    canManageSettings: true,
  },
  EDITOR: {
    canViewMembers: true,
    canAddMembers: true,
    canEditMembers: true,
    canApproveMembers: false,
    canRejectMembers: false,
    canSuspendMembers: false,
    canDeleteMembers: true,
    canEditCms: true,
    canRearrangeSections: true,
    canEditPricing: true,
    canManageTiers: true,
    canEditCardDesign: true,
    canGenerateBadges: true,
    canExportData: true,
    canImportMembers: false,
    canSyncNotion: false,
    canManageUsers: false,
    canManageRoles: false,
    canManageThemes: true,
    canManageSettings: false,
  },
  VIEWER: {
    canViewMembers: true,
    canAddMembers: false,
    canEditMembers: false,
    canApproveMembers: false,
    canRejectMembers: false,
    canSuspendMembers: false,
    canDeleteMembers: false,
    canEditCms: false,
    canRearrangeSections: false,
    canEditPricing: false,
    canManageTiers: false,
    canEditCardDesign: false,
    canGenerateBadges: false,
    canExportData: false,
    canImportMembers: false,
    canSyncNotion: false,
    canManageUsers: false,
    canManageRoles: false,
    canManageThemes: false,
    canManageSettings: false,
  },
} as const;

export type PermissionKey = keyof typeof PERMISSION_MATRIX['ADMIN'];

export function checkPermission(role: 'ADMIN' | 'EDITOR' | 'VIEWER', permission: PermissionKey): boolean {
  return PERMISSION_MATRIX[role]?.[permission] ?? false;
}

export async function enforceAuth(
  req: NextRequest,
  requiredPermission?: PermissionKey
): Promise<{ user: TokenPayload } | NextResponse> {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please login to continue.' }, { status: 401 });
  }

  if (requiredPermission && !checkPermission(user.role, requiredPermission)) {
    return NextResponse.json(
      { error: `Forbidden: Role '${user.role}' lacks '${requiredPermission}' permission.` },
      { status: 403 }
    );
  }

  return { user };
}

export async function createAuditLog(params: {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValue?: any;
  newValue?: any;
  req?: NextRequest;
}) {
  try {
    const ip = params.req?.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = params.req?.headers.get('user-agent') || 'system';

    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        oldValue: params.oldValue ? params.oldValue : undefined,
        newValue: params.newValue ? params.newValue : undefined,
        ipAddress: ip,
        userAgent: userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
