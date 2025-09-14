import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";

// Duration for rate limiting (15 minutes)
const duration = 15 * 60 * 1000;

// Rate limit for public endpoints
export const publicRateLimit = rateLimiter({
  windowMs: duration,
  limit: 100, // up to 100 requests per IP every 15 minutes
  keyGenerator: (c) => getConnInfo(c).remote.address ?? "",
  message: "Too many requests, please try again later.",
  standardHeaders: true, // includes X-RateLimit-* headers
});

// Rate limit for sensitive endpoints (login, register)
export const authRateLimit = rateLimiter({
  windowMs: duration,
  limit: 5, // 5 attempts every 15 minutes per IP
  keyGenerator: (c) => getConnInfo(c).remote.address ?? "",
  message: "Too many login attempts, try again later.",
  standardHeaders: true,
});
