import redisClient from "@configs/databases/sources/RedisConfig";
import { AuthInfrastructureModule } from "@modules/Auth/infrastructure/InfrastructureContainer";
import { RedisClient } from "bun";
import prisma from "configs/databases/sources/PrismaConfig";
import { LoggerConfig } from "configs/logger";
import { PrismaClient } from "generated/prisma";
import { container } from "tsyringe";

container.registerInstance<PrismaClient>(PrismaClient, prisma);
container.registerInstance<RedisClient>(RedisClient, redisClient);
container.registerSingleton<LoggerConfig>(LoggerConfig, LoggerConfig);

AuthInfrastructureModule();

export { container };
