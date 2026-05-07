/**
 * In-memory rate limiter for public POST endpoints.
 *
 * Limitations:
 *   - Per-instance only. On Vercel each region/lambda has its own
 *     state, so a determined attacker hitting different edge nodes
 *     can multiply the effective rate. Acceptable for early-stage
 *     anti-abuse. Swap to Upstash Redis (or similar) once we have
 *     real volume or hostile traffic.
 *
 * Usage:
 *   import { rateLimit } from "@/lib/rate-limit";
 *
 *   const limit = rateLimit(request, "walkthrough", { windowMs: 60_000, max: 5 });
 *   if (!limit.ok) {
 *     return NextResponse.json({ error: limit.error }, { status: 429 });
 *   }
 */
import type { NextRequest } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
};

// Module-level Map. Persists across requests within a single Node instance.
// Cleared on cold start, which is fine for this purpose.
const buckets = new Map<string, Bucket>();

// Light cleanup: every ~1000 calls, prune expired entries so the map
// does not grow unbounded across long-running instances.
let callCount = 0;
function maybeGC(now: number) {
  callCount++;
  if (callCount % 1000 !== 0) return;
  for (const [key, b] of buckets.entries()) {
    if (b.resetAt < now) buckets.delete(key);
  }
}

function getClientIp(request: NextRequest): string {
  // Vercel sets x-forwarded-for. Fall back to a static "unknown" so we
  // still rate-limit anonymous traffic together rather than letting it
  // through unbounded.
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export function rateLimit(
  request: NextRequest,
  endpoint: string,
  opts: { windowMs?: number; max?: number } = {}
): { ok: true } | { ok: false; error: string; retryAfter: number } {
  const windowMs = opts.windowMs ?? 60_000; // 1 minute default
  const max = opts.max ?? 10;

  const ip = getClientIp(request);
  const key = `${endpoint}:${ip}`;
  const now = Date.now();
  maybeGC(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (existing.count >= max) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return {
      ok: false,
      error: `Too many requests. Try again in ${retryAfter} seconds.`,
      retryAfter,
    };
  }

  existing.count++;
  return { ok: true };
}
