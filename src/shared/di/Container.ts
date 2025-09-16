import redisClient from "@configs/databases/sources/RedisConfig";
import { turso } from "@configs/databases/sources/TursoConfig";
import { AuthInfrastructureModule } from "@modules/Auth/infrastructure/InfrastructureContainer";
import { ProfileInfrastructureModule } from "@modules/Profile/infrastructure/InfrastructureContainer";
import prisma from "configs/databases/sources/PrismaConfig";
import { PrismaClient } from "generated/prisma";
import { container } from "tsyringe";
import { SHARED_TOKENS } from "./SharedTokens";
import Redis from "ioredis";

container.registerInstance<PrismaClient>(PrismaClient, prisma);
container.registerInstance<Redis>(Redis, redisClient);
container.registerInstance<typeof turso>(SHARED_TOKENS.TursoClient, turso);

AuthInfrastructureModule();
ProfileInfrastructureModule();

export { container };
