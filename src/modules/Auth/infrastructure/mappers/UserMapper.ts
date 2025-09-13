import { IUserEntity } from "@modules/Auth/core/models/IUserEntity";
import { IMapper } from "@shared/interfaces/IMapper";
import { User as PrismaUser } from "generated/prisma";

export const UserMapper: IMapper<IUserEntity, PrismaUser> = {
  toDomain(raw: PrismaUser): IUserEntity {
    return {
      userId: raw.userId,
      email: raw.email,
      username: raw.username,
      password: raw.password ?? undefined,
      isDisabled: raw.isDisabled,
      hadExternalAuth: raw.hadExternalAuth,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  },

  toPersistence(entity: IUserEntity): PrismaUser {
    return {
      id: 0, // prisma autoincrement, not used
      userId: entity.userId,
      email: entity.email,
      username: entity.username,
      password: entity.password ?? null,
      isDisabled: entity.isDisabled,
      hadExternalAuth: entity.hadExternalAuth,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  },
};
