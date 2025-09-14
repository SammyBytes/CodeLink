import { injectable, inject } from "tsyringe";
import type { ISessionService } from "@modules/Auth/application/services/ISessionService";
import type { ISessionRepository } from "@modules/Auth/core/repositories/ISessionRepository";
import { AUTH_INFRASTRUCTURE_TOKENS } from "../InfrastructureTokens";
import { ulid } from "ulid";
@injectable()
export class SessionService implements ISessionService {
  constructor(
    @inject(AUTH_INFRASTRUCTURE_TOKENS.ISessionRepository)
    private readonly sessionRepo: ISessionRepository,
    @inject(AUTH_INFRASTRUCTURE_TOKENS.RedisSessionRepository)
    private readonly redisRepo: ISessionRepository
  ) {}

  async create(
    userId: string,
    refreshToken: string,
    expiresIn: number,
    ip?: string,
    userAgent?: string
  ): Promise<string> {
    const sessionId = ulid();
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const refreshTokenHash = Bun.hash(refreshToken).toString();
    const now = new Date();

    // Save in Redis
    const redisCreate = this.redisRepo.create({
      sessionId,
      userId,
      refreshTokenHash,
      expiresAt,
      ip,
      userAgent,
      revoked: false,
      createdAt: now,
    });

    // Save in TursoDB
    const tursoCreate = this.sessionRepo.create({
      sessionId,
      userId,
      refreshTokenHash,
      expiresAt,
      ip,
      userAgent,
      revoked: false,
      createdAt: now,
    });

    await Promise.all([redisCreate, tursoCreate]);

    return sessionId;
  }

  async validate(userId: string, sessionId: string): Promise<boolean> {
    const session = await this.redisRepo.findBySessionId(sessionId);
    if (!session) return false;
    if (session.revoked || session.userId !== userId) return false;
    if (session.expiresAt < new Date()) return false;
    return true;
  }

  revoke(sessionId: string): Promise<void> {
    return Promise.allSettled([
      this.redisRepo.revoke(sessionId),
      this.sessionRepo.revoke(sessionId),
    ]).then(() => {});
  }

  async rotateRefreshToken(
    sessionId: string,
    newRefreshToken: string,
    expiresIn: number
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    const refreshTokenHash = Bun.hash(newRefreshToken).toString();
    await Promise.allSettled([
      this.redisRepo.rotateRefreshToken(sessionId, refreshTokenHash, expiresAt),
      this.sessionRepo.rotateRefreshToken(
        sessionId,
        refreshTokenHash,
        expiresAt
      ),
    ]);
  }
}
