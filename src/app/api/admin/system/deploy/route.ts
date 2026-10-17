import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token') || req.headers.get('x-deploy-token');

    const expectedToken =
      process.env.JWT_SECRET || 'eshetu_super_secret_jwt_key_2026_change_in_production_min32chars';

    if (!token || token !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized deploy request' }, { status: 401 });
    }

    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json({ error: 'Empty payload received' }, { status: 400 });
    }

    const rootDir = process.cwd();
    const tarPath = path.join(rootDir, 'deploy-bundle.tar.gz');

    fs.writeFileSync(tarPath, buffer);

    // Extract tar archive directly over the application directory
    execSync(`tar -xzf "${tarPath}" -C "${rootDir}"`, { stdio: 'inherit' });

    // Clean up archive
    try {
      fs.unlinkSync(tarPath);
    } catch (_) {}

    // Touch tmp/restart.txt to signal Passenger/LiteSpeed to reload
    const tmpDir = path.join(rootDir, 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    fs.writeFileSync(path.join(tmpDir, 'restart.txt'), new Date().toISOString(), 'utf8');

    // Trigger process exit so fresh worker is spawned
    setTimeout(() => {
      console.log('🔄 Deploy completed: exiting worker process to reload application...');
      process.exit(0);
    }, 500);

    return NextResponse.json({
      success: true,
      sizeBytes: buffer.length,
      message: 'Bundle deployed and extracted successfully. Server reloading with new build.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Deploy error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
