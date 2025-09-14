import { ISessionEntity } from "@modules/Auth/core/models/ISessionEntity";
import { SessionMapper } from "../../mappers/SessionMapper";
import { ISessionRepository } from "@modules/Auth/core/repositories/ISessionRepository";
import { RedisClient } from "bun";

import { inject, injectable } from "tsyringe";

@injectable()
export class RedisSessionRepository implements ISessionRepository {
  constructor(@inject(RedisClient) private redisClient: RedisClient) {}
  async findByRefreshToken(
    refreshToken: string
  ): Promise<ISessionEntity | null> {
    const keys: string[] = await this.redisClient.keys("session:*");
    for (const key of keys) {
      const sessionData = await this.redisClient.get(key);
      if (!sessionData) continue;
      try {
        const sessionObj = JSON.parse(sessionData);
        if (sessionObj.refreshTokenHash === refreshToken) {
          return SessionMapper.toDomain(sessionObj);
        }
      } catch (e) {
        // Ignore malformed session data
        continue;
      }
    }
    return null;
  }

  async create(session: ISessionEntity): Promise<void> {
    const key = `session:${session.sessionId}`;
    await this.redisClient.set(key, JSON.stringify(session));
    await this.redisClient.expire(
      key,
      this.getTimestampInSeconds(session.expiresAt)
    );
  }

  async findBySessionId(sessionId: string): Promise<ISessionEntity | null> {
    const key = `session:${sessionId}`;
    const sessionData = await this.redisClient.get(key);
    if (!sessionData) {
      return null;
    }
    const sessionObj = JSON.parse(sessionData);
    return SessionMapper.toDomain(sessionObj);
  }

  async revoke(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await this.redisClient.del(key);
  }

  async revokeAllForUser(userId: string): Promise<void> {
    const keys: string[] = await this.redisClient.keys("session:*");
    for (const key of keys) {
      const sessionData = await this.redisClient.get(key);
      if (!sessionData) continue;
      try {
        const sessionObj = JSON.parse(sessionData);
        if (sessionObj.userId === userId) {
          await this.redisClient.del(key);
        }
      } catch (e) {
        // Ignore malformed session data
        continue;
      }
    }
  }

  private getTimestampInSeconds(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  }
}
