import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { createAuditLog } from '@/lib/auth';

export async function POST(req: NextRequest) {
  // Rate limit: 10 inquiries per 15 minutes per IP
  const rateLimitResponse = checkRateLimit(req, 'marketing:inquiry', 10, 15 * 60 * 1000);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const { companyName, industry, contactPerson, email, phone, campaignType, budgetRange, message } = body;

    if (!companyName || !contactPerson || !phone) {
      return NextResponse.json(
        { error: 'Company name, contact person, and phone number are required.' },
        { status: 400 }
      );
    }

    const inquiryRecord = {
      companyName: String(companyName).trim(),
      industry: String(industry || 'General').trim(),
      contactPerson: String(contactPerson).trim(),
      email: email ? String(email).trim() : null,
      phone: String(phone).trim(),
      campaignType: String(campaignType || 'Integrated Sponsorship').trim(),
      budgetRange: String(budgetRange || 'Flexible').trim(),
      message: message ? String(message).trim() : '',
      receivedAt: new Date().toISOString(),
      status: 'NEW',
    };

    // Save as audit log or database record if available
    try {
      await createAuditLog({
        action: 'MARKETING_INQUIRY_RECEIVED',
        entityType: 'MarketingInquiry',
        newValue: inquiryRecord,
        req,
      });
    } catch (dbError) {
      console.warn('Could not persist inquiry to audit log (database might be offline):', dbError);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your partnership inquiry has been received. Our corporate marketing desk will reach out within 24 hours.',
      inquiry: inquiryRecord,
    });
  } catch (error: any) {
    console.error('Marketing Inquiry Submission Error:', error);
    return NextResponse.json({ error: 'Failed to process inquiry' }, { status: 500 });
  }
}
