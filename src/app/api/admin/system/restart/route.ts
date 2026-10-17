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
      return NextResponse.json({ error: 'Unauthorized restart request' }, { status: 401 });
    }

    const rootDir = process.cwd();
    const candidatePaths = [
      path.join(rootDir, 'deploy.zip'),
      '/home/comedizx/comedianeshetu.com/deploy/eshetu-portal/deploy.zip',
      '/home/comedizx/comedianeshetu.com/deploy/deploy.zip',
      path.join(process.env.HOME || '/home/comedizx', 'comedianeshetu.com/deploy/eshetu-portal/deploy.zip'),
      path.join(process.env.HOME || '/home/comedizx', 'comedianeshetu.com/deploy/deploy.zip'),
    ];

    let foundZip: string | null = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        foundZip = p;
        break;
      }
    }

    let extracted = false;

    if (foundZip) {
      try {
        console.log(`📦 Auto-extracting ${foundZip} via restart API into ${rootDir}...`);
        try {
          execSync(`unzip -o "${foundZip}" -d "${rootDir}"`, { cwd: rootDir, stdio: 'inherit' });
        } catch {
          execSync(`python3 -c "import zipfile; zipfile.ZipFile('${foundZip}').extractall('${rootDir}')"`, { cwd: rootDir, stdio: 'inherit' });
        }
        if (fs.existsSync(foundZip)) {
          fs.unlinkSync(foundZip);
        }
        extracted = true;
        console.log('✅ deploy.zip extracted successfully into live root!');
      } catch (extractErr) {
        console.error('Failed to extract deploy.zip in restart API:', extractErr);
      }
    }

    // Touch tmp/restart.txt so Phusion Passenger detects the restart signal on the next HTTP request
    try {
      const tmpDir = path.join(rootDir, 'tmp');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      fs.writeFileSync(path.join(tmpDir, 'restart.txt'), new Date().toISOString(), 'utf8');
      console.log('🔄 Touched tmp/restart.txt');
    } catch (touchErr) {
      console.error('Failed to touch tmp/restart.txt:', touchErr);
    }

    // Schedule graceful worker exit to allow cPanel Passenger/LiteSpeed to spawn a fresh worker
    setTimeout(() => {
      console.log('🔄 Restart triggered via deploy API: exiting worker process to reload application...');
      process.exit(0);
    }, 500);

    return NextResponse.json({
      success: true,
      extracted,
      message: extracted
        ? 'deploy.zip extracted and worker restart initiated. cPanel will reload the application with fresh build manifests.'
        : 'Worker restart initiated. cPanel will reload the application with fresh build manifests within seconds.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
