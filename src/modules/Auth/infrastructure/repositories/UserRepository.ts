import { IUserEntity } from "@modules/Auth/core/models/IUserEntity";
import { IUserRepository } from "@modules/Auth/core/repositories/IUserRepository";
import { UserMapper } from "../mappers/UserMapper";
import { PrismaClient } from "generated/prisma";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async create(user: IUserEntity): Promise<IUserEntity> {
    const created = await this.prisma.user.create({
      data: UserMapper.toPersistence(user),
    });
    return UserMapper.toDomain(created);
  }

  async findByEmail(email: string): Promise<IUserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? UserMapper.toDomain(user) : null;
  }
}
