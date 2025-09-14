import { SignJWT, jwtVerify } from "jose";
// Ensure JWT_SECRET is defined
if (!Bun.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
const JWT_SECRET = new TextEncoder().encode(Bun.env.JWT_SECRET);

export const ACCESS_TOKEN_EXP = 15 * 60; // 15 minutes
export const REFRESH_TOKEN_EXP = 7 * 24 * 60 * 60; // 7 days

import type { JWTPayload } from "jose";

export interface AccessTokenPayload extends JWTPayload {
  userId: string;
  sessionId: string;
}

export async function createJWT(
  payload: AccessTokenPayload,
  expiresIn: number = ACCESS_TOKEN_EXP
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyJWT(
  token: string
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as AccessTokenPayload;
  } catch (err) {
    console.warn("JWT verification failed", err);
    return null;
  }
}
