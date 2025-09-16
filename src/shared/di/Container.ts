import redisClient from "@configs/databases/sources/RedisConfig";
import { turso } from "@configs/databases/sources/TursoConfig";
import { Client } from "@libsql/client";
import { AuthInfrastructureModule } from "@modules/Auth/infrastructure/InfrastructureContainer";
import { ProfileInfrastructureModule } from "@modules/Profile/infrastructure/InfrastructureContainer";
import { RedisClient } from "bun";
import prisma from "configs/databases/sources/PrismaConfig";
import { LoggerConfig } from "configs/logger";
import { PrismaClient } from "generated/prisma";
import { container } from "tsyringe";
import { SHARED_TOKENS } from "./SharedTokens";

container.registerInstance<PrismaClient>(PrismaClient, prisma);
container.registerInstance<RedisClient>(RedisClient, redisClient);
container.registerInstance<typeof turso>(SHARED_TOKENS.TursoClient, turso);

AuthInfrastructureModule();
ProfileInfrastructureModule();

export { container };
