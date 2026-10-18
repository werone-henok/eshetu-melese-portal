import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing drive file id' }, { status: 400 });
  }

  // Sanitize Google Drive ID (alphanumeric and dashes/underscores only)
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
  }

  const driveDownloadUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download`;
  const rangeHeader = req.headers.get('range');

  try {
    const fetchHeaders: HeadersInit = {};
    if (rangeHeader) {
      fetchHeaders['Range'] = rangeHeader;
    }

    let driveRes = await fetch(driveDownloadUrl, {
      headers: fetchHeaders,
      redirect: 'follow',
    });

    if (!driveRes.ok && driveRes.status !== 206) {
      const fallbackUrl = `https://drive.google.com/uc?export=download&id=${id}`;
      driveRes = await fetch(fallbackUrl, {
        headers: fetchHeaders,
        redirect: 'follow',
      });
    }

    if (!driveRes.ok && driveRes.status !== 206) {
      return NextResponse.json(
        { error: `Upstream error: ${driveRes.statusText}` },
        { status: driveRes.status }
      );
    }

    const responseHeaders = new Headers();
    // Return standard video MIME type for browser playback
    responseHeaders.set('Content-Type', 'video/mp4');
    responseHeaders.set('Content-Disposition', 'inline');
    responseHeaders.set('Accept-Ranges', 'bytes');
    responseHeaders.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

    const contentLength = driveRes.headers.get('content-length');
    if (contentLength) {
      responseHeaders.set('Content-Length', contentLength);
    }

    const contentRange = driveRes.headers.get('content-range');
    if (contentRange) {
      responseHeaders.set('Content-Range', contentRange);
    }

    return new NextResponse(driveRes.body, {
      status: driveRes.status, // 200 or 206
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('Media stream error for id:', id, error);
    return NextResponse.json({ error: 'Failed to stream video' }, { status: 500 });
  }
}
