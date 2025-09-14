export interface ISessionService {
  create(
    userId: string,
    refreshToken: string,
    expiresIn: number,
    ip?: string,
    userAgent?: string
  ): Promise<string>;

  findByRefreshToken(
    refreshToken: string
  ): Promise<{ userId: string; sessionId: string } | null>;

  validate(userId: string, sessionId: string): Promise<boolean>;
  revoke(sessionId: string): Promise<void>;
}
