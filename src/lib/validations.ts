import { z } from 'zod';

// ==========================================
// Authentication Schemas
// ==========================================
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address format')
    .max(150, 'Email exceeds maximum length')
    .trim(),
  password: z
    .string()
    .min(1, 'Password cannot be empty')
    .max(128, 'Password exceeds maximum length'),
});

// ==========================================
// Member Registration Schemas
// ==========================================
export const RegisterMemberSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .trim(),
  country: z
    .string()
    .max(80, 'Country name is too long')
    .default('Ethiopia'),
  countryCode: z
    .string()
    .regex(/^\+[0-9]{1,6}$/, 'Invalid country dial code (e.g. +251, +1)')
    .default('+251'),
  phoneNumber: z
    .string()
    .min(4, 'Phone number is too short')
    .max(25, 'Phone number is too long')
    .regex(/^[0-9\s()+-]+$/, 'Phone number contains invalid characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email format')
    .max(150, 'Email is too long')
    .optional()
    .nullable(),
  tierId: z
    .string()
    .min(1, 'Please select a valid tier'),
  paymentMethod: z
    .string()
    .max(100)
    .default('Direct Deposit / Telebirr'),
  paymentReference: z
    .string()
    .max(150)
    .default('Receipt Uploaded'),
});

// ==========================================
// Member Search Schema
// ==========================================
export const MemberSearchSchema = z.object({
  q: z
    .string()
    .max(100, 'Search query must not exceed 100 characters')
    .optional()
    .default(''),
});

// ==========================================
// User Management Schemas (Admin)
// ==========================================
export const UserCreateSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(150)
    .trim(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100)
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).default('VIEWER'),
  isActive: z.boolean().default(true),
});

export const UserUpdateSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).max(128).optional(),
});

// ==========================================
// CMS Settings Schema
// ==========================================
export const BrandingSettingsSchema = z.object({
  siteName: z.string().min(1).max(100).trim().optional(),
  siteNameAm: z.string().min(1).max(100).trim().optional(),
  tagline: z.string().max(200).trim().optional(),
  taglineAm: z.string().max(200).trim().optional(),
  logoUrl: z.string().max(500).optional(),
  faviconUrl: z.string().max(500).optional(),
  paymentInstructions: z.string().max(2000).optional(),
  paymentInstructionsAm: z.string().max(2000).optional(),
});

// ==========================================
// Tier Schema
// ==========================================
export const TierCreateSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  priceEtb: z.number().nonnegative(),
  priceUsd: z.number().nonnegative().default(0),
  description: z.string().max(500).optional().default(''),
  perks: z.array(z.string().max(200)).default([]),
  badgeColor: z.string().max(20).default('#D4AF37'),
  displayOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
  ctaText: z.string().max(100).default('Register for Tier'),
});
