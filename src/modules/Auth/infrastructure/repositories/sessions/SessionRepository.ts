import type { ISessionEntity } from "@modules/Auth/core/models/ISessionEntity";
import type { ISessionRepository } from "@modules/Auth/core/repositories/ISessionRepository";
import { PrismaClient } from "generated/prisma";

import { inject, injectable } from "tsyringe";
import { SessionMapper } from "../../mappers/SessionMapper";

@injectable()
export class SessionRepository implements ISessionRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async create(session: ISessionEntity): Promise<void> {
    await this.prisma.sessions.create({
      data: session,
    });
  }
  async findBySessionId(sessionId: string): Promise<ISessionEntity | null> {
    const session = await this.prisma.sessions.findUnique({
      where: { sessionId: sessionId, revoked: false },
    });

    return session ? SessionMapper.toDomain(session) : null;
  }
  async revoke(sessionId: string): Promise<void> {
    await this.prisma.sessions.delete({
      where: { sessionId: sessionId, revoked: false },
    });
  }
  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.sessions.deleteMany({
      where: { userId, revoked: false },
    });
  }
  async rotateRefreshToken(
    sessionId: string,
    newHash: string,
    expiresAt: Date
  ): Promise<void> {
    await this.prisma.sessions.update({
      where: { sessionId: sessionId },
      data: { refreshTokenHash: newHash, expiresAt },
    });
  }
}
