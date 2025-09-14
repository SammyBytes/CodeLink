import z from "zod";

export const createSessionSchema = z.object({
  userId: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresAt: z.date(),
});

export const refreshSessionSchema = z.object({
  refreshToken: z.string().min(1),
});

export const revokeSessionSchema = z.object({
  sessionId: z.string().min(1),
});
