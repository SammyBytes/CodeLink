export interface ISessionEntity {
  sessionId: string; // ULID
  userId: string; // ULID User
  refreshTokenHash: string;
  revoked: boolean;
  createdAt: Date;
  expiresAt: Date;
  ip?: string;
  userAgent?: string;
}
