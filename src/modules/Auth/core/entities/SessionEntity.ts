import { ISessionEntity } from "../models/ISessionEntity";

export class SessionEntity implements ISessionEntity {
  sessionId!: string;
  userId!: string;
  refreshTokenHash!: string;
  revoked!: boolean;
  createdAt!: Date;
  expiresAt!: Date;
  ip?: string | undefined;
  userAgent?: string | undefined;

  constructor(props: ISessionEntity) {
    Object.assign(this, props);
  }

  static createNew(
    userId: string,
    refreshTokenHash: string,
    expiresAt: Date,
    ip?: string,
    userAgent?: string
  ): SessionEntity {
    if (!userId) throw new Error("Invalid userId");
    if (!refreshTokenHash) throw new Error("Invalid refreshTokenHash");
    if (expiresAt <= new Date()) throw new Error("Invalid expiresAt");

    return new SessionEntity({
      sessionId: "", // DB will set it
      userId,
      refreshTokenHash,
      revoked: false,
      createdAt: new Date(),
      expiresAt,
      ip,
      userAgent,
    });
  }
}
