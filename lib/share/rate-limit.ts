export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
};

type RateLimitOptions = {
  limit?: number;
  windowMs?: number;
};

type RateLimitState = {
  count: number;
  resetAt: number;
};

const shareRateLimits = new Map<string, RateLimitState>();

export function checkShareRateLimit(
  key: string,
  { limit = 60, windowMs = 60_000 }: RateLimitOptions = {}
): RateLimitResult {
  const now = Date.now();
  const existing = shareRateLimits.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    const count = 1;
    shareRateLimits.set(key, { count, resetAt });
    return {
      allowed: true,
      remaining: Math.max(limit - count, 0),
      resetAt,
    };
  }

  const nextCount = existing.count + 1;
  const remaining = Math.max(limit - nextCount, 0);
  const allowed = nextCount <= limit;
  shareRateLimits.set(key, { count: nextCount, resetAt: existing.resetAt });

  return {
    allowed,
    remaining,
    resetAt: existing.resetAt,
    retryAfter: allowed ? undefined : Math.ceil((existing.resetAt - now) / 1000),
  };
}
