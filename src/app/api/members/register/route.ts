import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { normalizePhoneNumber } from '@/lib/countries';
import { saveUploadedFile } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fullName = formData.get('fullName') as string;
    const country = (formData.get('country') as string) || 'Ethiopia';
    const countryCode = (formData.get('countryCode') as string) || '+251';
    const phoneNumber = formData.get('phoneNumber') as string;
    const email = (formData.get('email') as string) || null;
    const tierId = formData.get('tierId') as string;
    const paymentMethod = (formData.get('paymentMethod') as string) || 'Direct Deposit / Telebirr';
    const paymentReference = (formData.get('paymentReference') as string) || 'Receipt Uploaded';

    const receiptFile = formData.get('paymentReceipt') as File | null;
    const photoFile = formData.get('photo') as File | null;

    if (!fullName || !phoneNumber || !tierId) {
      return NextResponse.json({ error: 'Please provide all required registration fields.' }, { status: 400 });
    }

    if (!receiptFile || receiptFile.size === 0) {
      return NextResponse.json({ error: 'Please upload your payment receipt or transfer screenshot.' }, { status: 400 });
    }

    const normalizedPhone = normalizePhoneNumber(countryCode, phoneNumber);

    // Check duplicate active membership
    const existing = await prisma.member.findUnique({
      where: { normalizedPhone },
    });

    if (existing && !existing.isDeleted && existing.status !== 'REJECTED') {
      return NextResponse.json(
        {
          error: `A membership application already exists for ${normalizedPhone} with status: ${existing.status} (Code: ${existing.membershipCode}).`,
          existingCode: existing.membershipCode,
          status: existing.status,
        },
        { status: 409 }
      );
    }

    // Save uploaded files
    let paymentReceiptUrl = null;
    if (receiptFile && receiptFile.size > 0) {
      const savedReceipt = await saveUploadedFile(receiptFile, 'receipts');
      paymentReceiptUrl = savedReceipt.url;
    }

    let photoUrl = null;
    if (photoFile && photoFile.size > 0) {
      const savedPhoto = await saveUploadedFile(photoFile, 'avatars');
      photoUrl = savedPhoto.url;
    }

    // Generate unique membership code (e.g. EM-2026-XXXX)
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
        email: email ? email.trim() : null,
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
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed.' }, { status: 500 });
  }
}
