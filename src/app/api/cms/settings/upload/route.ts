import { NextRequest, NextResponse } from 'next/server';
import { enforceAuth, createAuditLog } from '@/lib/auth';
import { saveUploadedFile } from '@/lib/storage';

export async function POST(req: NextRequest) {
  const auth = await enforceAuth(req, 'canEditCms');
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate mime type (images & svg)
    if (!file.type.startsWith('image/') && !file.type.includes('svg')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image (PNG, SVG, JPG, WebP, GIF).' },
        { status: 400 }
      );
    }

    const saved = await saveUploadedFile(file, 'branding');

    await createAuditLog({
      userId: auth.user.userId,
      action: 'LOGO_UPLOADED',
      entityType: 'Media',
      newValue: { url: saved.url, filename: saved.filename, size: saved.size },
      req,
    });

    return NextResponse.json({
      success: true,
      url: saved.url,
      filename: saved.filename,
    });
  } catch (error: any) {
    console.error('Settings Upload Error:', error);
    return NextResponse.json(
      { error: error.message && !error.message.includes('ENOENT') ? error.message : 'File upload failed' },
      { status: 400 }
    );
  }
}
