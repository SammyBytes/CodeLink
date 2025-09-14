import { IProfileEntity } from "@modules/Profile/core/models/IProfileEntity";
import { IMapper } from "@shared/interfaces/IMapper";
import { Profile as PrismaProfile } from "generated/prisma";

export const profileMapper: IMapper<IProfileEntity, PrismaProfile> = {
  toDomain: (prismaProfile: PrismaProfile): IProfileEntity => ({
    profileId: prismaProfile.id,
    userId: prismaProfile.userId,
    bio: prismaProfile.bio,
    avatar: prismaProfile.avatar ?? undefined,
    name: prismaProfile.name,
    lastName: prismaProfile.lastName,
    country: prismaProfile.country ?? undefined,
    city: prismaProfile.city ?? undefined,
    languages: Array.isArray(prismaProfile.languages)
      ? prismaProfile.languages.map(String)
      : [],
    frameworks: Array.isArray(prismaProfile.frameworks)
      ? prismaProfile.frameworks.map(String)
      : [],
    tools: Array.isArray(prismaProfile.tools)
      ? prismaProfile.tools.map(String)
      : [],
    createdAt: prismaProfile.createdAt,
    updatedAt: prismaProfile.updatedAt,
  }),
  toPersistence: (profile: IProfileEntity): PrismaProfile => ({
    id: profile.profileId,
    userId: profile.userId,
    bio: profile.bio ?? "",
    avatar: profile.avatar ?? null,
    name: profile.name,
    lastName: profile.lastName,
    country: profile.country ?? null,
    city: profile.city ?? null,
    languages: profile.languages,
    frameworks: profile.frameworks,
    tools: profile.tools,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  }),
};
