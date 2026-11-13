import { Redis } from "@upstash/redis";

const memory = new Map<string, { count: number; expiresAt: number }>();

export async function checkBookingRateLimit(ip: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const key = `booking-rate:${ip}`;

  if (url && token) {
    const redis = new Redis({ url, token });
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 3600);
    return { allowed: count <= 5, remaining: Math.max(0, 5 - count) };
  }

  const now = Date.now();
  const current = memory.get(key);
  if (!current || current.expiresAt < now) {
    memory.set(key, { count: 1, expiresAt: now + 3_600_000 });
    return { allowed: true, remaining: 4 };
  }
  current.count += 1;
  return { allowed: current.count <= 5, remaining: Math.max(0, 5 - current.count) };
}
