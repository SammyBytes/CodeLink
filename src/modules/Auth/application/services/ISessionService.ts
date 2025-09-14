export interface ISessionService {
  create(
    userId: string,
    refreshToken: string,
    expiresIn: number,
    ip?: string,
    userAgent?: string
  ): Promise<string>;

  validate(userId: string, sessionId: string): Promise<boolean>;
  revoke(sessionId: string): Promise<void>;
  rotateRefreshToken(
    sessionId: string,
    newRefreshToken: string,
    expiresIn: number
  ): Promise<void>;
}
