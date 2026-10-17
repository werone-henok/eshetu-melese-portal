import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token') || req.headers.get('x-deploy-token');

    const expectedToken =
      process.env.JWT_SECRET || 'eshetu_super_secret_jwt_key_2026_change_in_production_min32chars';

    if (!token || token !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized restart request' }, { status: 401 });
    }

    // Schedule graceful worker exit to allow cPanel Passenger/LiteSpeed to spawn a fresh worker
    setTimeout(() => {
      console.log('🔄 Restart triggered via deploy API: exiting worker process to reload application...');
      process.exit(0);
    }, 500);

    return NextResponse.json({
      success: true,
      message: 'Worker restart initiated. cPanel will reload the application with fresh build manifests within seconds.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
