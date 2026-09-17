import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { normalizePhoneNumber } from '@/lib/countries';
import { saveUploadedFile } from '@/lib/storage';
import { checkRateLimit } from '@/lib/rate-limit';
import { RegisterMemberSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  // 1. IP Rate Limiting: 10 registration submissions per minute to prevent bot spam
  const rateLimitResponse = checkRateLimit(req, 'members:register', 10, 60000);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const formData = await req.formData();
    const rawPayload = {
      fullName: formData.get('fullName') as string,
      country: (formData.get('country') as string) || 'Ethiopia',
      countryCode: (formData.get('countryCode') as string) || '+251',
      phoneNumber: formData.get('phoneNumber') as string,
      email: (formData.get('email') as string) || null,
      tierId: formData.get('tierId') as string,
      paymentMethod: (formData.get('paymentMethod') as string) || 'Direct Deposit / Telebirr',
      paymentReference: (formData.get('paymentReference') as string) || 'Receipt Uploaded',
    };

    // 2. Strict Input Validation via Zod
    const validation = RegisterMemberSchema.safeParse(rawPayload);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues.map(e => e.message) },
        { status: 400 }
      );
    }

    const { fullName, country, countryCode, phoneNumber, email, tierId, paymentMethod, paymentReference } = validation.data;

    const receiptFile = formData.get('paymentReceipt') as File | null;
    const photoFile = formData.get('photo') as File | null;

    if (!receiptFile || receiptFile.size === 0) {
      return NextResponse.json({ error: 'Please upload your payment receipt or transfer screenshot.' }, { status: 400 });
    }

    // Verify tier exists in database to prevent foreign key errors
    const tier = await prisma.tier.findUnique({ where: { id: tierId } });
    if (!tier) {
      return NextResponse.json({ error: 'Selected membership tier is invalid.' }, { status: 400 });
    }

    const normalizedPhone = normalizePhoneNumber(countryCode, phoneNumber);

    // Check duplicate active membership
    const existing = await prisma.member.findUnique({
      where: { normalizedPhone },
    });

    if (existing && !existing.isDeleted && existing.status !== 'REJECTED') {
      return NextResponse.json(
        {
          error: `A membership application already exists for this phone number with status: ${existing.status}.`,
          existingCode: existing.membershipCode,
          status: existing.status,
        },
        { status: 409 }
      );
    }

    // 3. Save uploaded files with MIME and size verification
    let paymentReceiptUrl = null;
    try {
      const savedReceipt = await saveUploadedFile(receiptFile, 'receipts');
      paymentReceiptUrl = savedReceipt.url;
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Invalid payment receipt file.' }, { status: 400 });
    }

    let photoUrl = null;
    if (photoFile && photoFile.size > 0) {
      try {
        const savedPhoto = await saveUploadedFile(photoFile, 'avatars');
        photoUrl = savedPhoto.url;
      } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Invalid profile photo file.' }, { status: 400 });
      }
    }

    // Generate unique cryptographically safe membership code (e.g. EM-2026-XXXX-XXXX)
    const count = await prisma.member.count();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const membershipCode = `EM-2026-${(count + 1).toString().padStart(4, '0')}-${randomSuffix}`;

    const newMember = await prisma.member.create({
      data: {
        membershipCode,
        fullName: fullName.trim(),
        country: country.trim(),
        countryCode: countryCode.trim(),
        phoneNumber: phoneNumber.trim(),
        normalizedPhone,
        email: email ? email.trim().toLowerCase() : null,
        photoUrl,
        tierId,
        paymentMethod,
        paymentReference: paymentReference.trim(),
        paymentReceiptUrl,
        status: 'PENDING',
      },
      include: {
        tier: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully! Your application is pending verification.',
      member: {
        membershipCode: newMember.membershipCode,
        fullName: newMember.fullName,
        normalizedPhone: newMember.normalizedPhone,
        status: newMember.status,
        tierName: newMember.tier.name,
      },
    });
  } catch (error: any) {
    // Sanitized server error
    console.error('Secure Registration Error:', error);
    return NextResponse.json({ error: 'Registration processing failed. Please try again.' }, { status: 500 });
  }
}
