import { ISessionEntity } from "../models/ISessionEntity";

export interface ISessionRepository {
  create(session: ISessionEntity): Promise<void>;
  findBySessionId(sessionId: string): Promise<ISessionEntity | null>;
  revoke(sessionId: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
  rotateRefreshToken(
    sessionId: string,
    newHash: string,
    expiresAt: Date
  ): Promise<void>;
}
