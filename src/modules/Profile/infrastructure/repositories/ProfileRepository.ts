import { IProfileEntity } from "@modules/Profile/core/models/IProfileEntity";
import type { IProfileRepository } from "@modules/Profile/core/repositories/IProfileRepository";
import { PrismaClient } from "generated/prisma";

import { inject, injectable } from "tsyringe";
import { profileMapper } from "../mappers/ProfileMapper";
import { InputJsonValue } from "generated/prisma/runtime/library";

@injectable()
export class ProfileRepository implements IProfileRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async create(profile: IProfileEntity): Promise<IProfileEntity> {
    const persistence = profileMapper.toPersistence(profile);
    const created = await this.prisma.profile.create({
      data: {
        ...persistence,
        languages: persistence.languages as InputJsonValue,
        frameworks: persistence.frameworks as InputJsonValue,
        tools: persistence.tools as InputJsonValue,
      },
    });
    return profileMapper.toDomain(created);
  }

  async findByUserId(userId: string): Promise<IProfileEntity | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId, AND: [{ user: { isDisabled: false } }] },
      include: {
        user: {
          select: {
            email: true,
            username: true,
          },
        },
      },
    });
    return profile ? profileMapper.toDomain(profile) : null;
  }

  async update(profile: IProfileEntity): Promise<IProfileEntity> {
    const persistence = profileMapper.toPersistence(profile);
    const updated = await this.prisma.profile.update({
      where: { userId: profile.userId, AND: [{ user: { isDisabled: false } }] },
      data: {
        ...persistence,
        languages: persistence.languages as InputJsonValue,
        frameworks: persistence.frameworks as InputJsonValue,
        tools: persistence.tools as InputJsonValue,
      },
    });
    return profileMapper.toDomain(updated);
  }
}
