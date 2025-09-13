import { AuthInfrastructureModule } from "@modules/Auth/infrastructure/InfrastructureContainer";
import prisma from "configs/databases/sources/PrismaConfig";
import { LoggerConfig } from "configs/logger";
import { PrismaClient } from "generated/prisma";
import { container } from "tsyringe";

container.registerInstance<PrismaClient>(PrismaClient, prisma);
container.registerSingleton<LoggerConfig>(LoggerConfig, LoggerConfig);

AuthInfrastructureModule();

export { container };
