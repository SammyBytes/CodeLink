import { Hono } from "hono";
import { createFactory, createMiddleware } from "hono/factory";
import { Context, MiddlewareHandler } from "hono";
import { container } from "tsyringe";
import { ISessionService } from "@modules/Auth/application/services/ISessionService";
import { AUTH_INFRASTRUCTURE_TOKENS } from "@modules/Auth/infrastructure/InfrastructureTokens";

const sessionService = container.resolve<ISessionService>(
  AUTH_INFRASTRUCTURE_TOKENS.ISessionService
);

type SessionEnvironment = {
  Variables: {
    Session: { userId: string; sessionId: string };
  };
};
/**
 * Middleware to validate session from JWT payload.
 * Expects `jwtPayload` to be set in context (e.g., by a previous JWT middleware).
 * If session is invalid, responds with 401 Unauthorized.
 * If valid, calls next middleware/handler.
 */
export const SessionMiddleware = createMiddleware<SessionEnvironment>(
  async (c: Context, next) => {
    try {
      const payload = c.get("jwtPayload") as SessionPayload | undefined;
      if (!payload) {
        return c.json({ message: "Unauthorized: no payload" }, 401);
      }

      const valid = await sessionService.validate(
        payload.userId,
        payload.sessionId
      );
      if (!valid) {
        await sessionService.revoke(payload.sessionId);
        c.set("Session", null);
        return c.json({ message: "Unauthorized: invalid session" }, 401);
      }

      // Session is valid, proceed to next
      c.set("Session", {
        userId: payload.userId,
        sessionId: payload.sessionId,
      });

      await next();
    } catch (error) {
      console.error("SessionMiddleware error:", error);
      return c.json({ message: "Unauthorized: session check failed" }, 401);
    }
  }
);

type SessionPayload = {
  userId: string;
  sessionId: string;
  iat: number;
  exp: number;
};
