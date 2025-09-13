import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";

export const publicRateLimit = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 5, // máximo 5 peticiones por IP
  keyGenerator: (c) => getConnInfo(c).remote.address ?? "",
  message: "Too many requests, please try again later.",
  standardHeaders: true,
});
