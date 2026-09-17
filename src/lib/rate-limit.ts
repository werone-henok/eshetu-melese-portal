import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory sliding window / token bucket storage per route category
const rateLimitStores = new Map<string, Map<string, RateLimitRecord>>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Checks rate limits for a given request.
 * @param req NextRequest
 * @param key Category or namespace (e.g. 'auth:login', 'members:register')
 * @param maxRequests Maximum allowed requests within the window
 * @param windowMs Window in milliseconds (e.g. 60000 = 1 minute)
 * @returns null if allowed, or NextResponse with HTTP 429 if limit exceeded
 */
export function checkRateLimit(
  req: NextRequest,
  key: string,
  maxRequests: number = 20,
  windowMs: number = 60000
): NextResponse | null {
  if (!rateLimitStores.has(key)) {
    rateLimitStores.set(key, new Map<string, RateLimitRecord>());
  }

  const store = rateLimitStores.get(key)!;
  const ip = getClientIp(req);
  const now = Date.now();

  const record = store.get(ip);

  if (!record || now > record.resetTime) {
    // Window expired or new client
    store.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return null;
  }

  record.count += 1;

  if (record.count > maxRequests) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
    return NextResponse.json(
      {
        error: 'Too many requests. Please slow down and try again later.',
        retryAfter: retryAfterSec,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Limit': String(maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(record.resetTime / 1000)),
        },
      }
    );
  }

  return null;
}

// Periodic cleanup of stale rate-limit records every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const store of rateLimitStores.values()) {
      for (const [ip, record] of store.entries()) {
        if (now > record.resetTime) {
          store.delete(ip);
        }
      }
    }
  }, 300000);
}
