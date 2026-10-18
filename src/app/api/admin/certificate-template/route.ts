import { NextRequest, NextResponse } from 'next/server';
import { enforceAuth } from '@/lib/auth';
import {
  getCertificateTemplate,
  saveCertificateTemplate,
  resetCertificateTemplate,
} from '@/lib/certificate-service';

export async function GET(req: NextRequest) {
  const auth = await enforceAuth(req, 'canEditCardDesign');
  if (auth instanceof NextResponse) return auth;

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

export async function POST(req: NextRequest) {
  const auth = await enforceAuth(req, 'canEditCardDesign');
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const template = await saveCertificateTemplate(body, auth.user.userId, req);
    return NextResponse.json({ success: true, template });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save certificate template' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await enforceAuth(req, 'canEditCardDesign');
  if (auth instanceof NextResponse) return auth;

  try {
    const template = await resetCertificateTemplate(auth.user.userId, req);
    return NextResponse.json({ success: true, template, message: 'Certificate template reset to default' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to reset certificate template' },
      { status: 500 }
    );
  }
}
