import { NextResponse } from 'next/server';
import { getCertificateTemplate } from '@/lib/certificate-service';

export async function GET() {
  try {
    const template = await getCertificateTemplate();
    return NextResponse.json({ success: true, template });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch certificate template' },
      { status: 500 }
    );
  }
}
