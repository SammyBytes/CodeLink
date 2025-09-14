import { ISessionEntity } from "@modules/Auth/core/models/ISessionEntity";
import { IMapper } from "@shared/interfaces/IMapper";
import { Sessions as SessionsPrisma } from "generated/prisma";

export const SessionMapper: IMapper<ISessionEntity, SessionsPrisma> = {
  toDomain(raw: SessionsPrisma): ISessionEntity {
    return {
      sessionId: raw.sessionId,
      userId: raw.userId,
      refreshTokenHash: raw.refreshTokenHash,
      revoked: raw.revoked,
      createdAt: raw.createdAt,
      expiresAt: raw.expiresAt,
      ip: raw.ip ?? undefined,
      userAgent: raw.userAgent ?? undefined,
    };
  },
  toPersistence(entity: ISessionEntity): SessionsPrisma {
    return {
      id: 0, // prisma autoincrement, not used
      sessionId: entity.sessionId,
      userId: entity.userId,
      refreshTokenHash: entity.refreshTokenHash,
      revoked: entity.revoked,
      createdAt: entity.createdAt,
      expiresAt: entity.expiresAt,
      ip: entity.ip ?? null,
      userAgent: entity.userAgent ?? null,
    };
  },
};
