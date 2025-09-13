import { container } from "tsyringe";
import type { IUserRepository } from "@modules/Auth/core/repositories/IUserRepository";
import { UserRepository } from "./repositories/UserRepository";
import { AUTH_INFRASTRUCTURE_TOKENS } from "./InfrastructureTokens";
import type { IPasswordHasherServices } from "../application/services/IPasswordHasherServices";
import { Argon2dHasherServices } from "./services/hashers/Argon2dHasherServices";
import { AuthApplicationModule } from "../application/ApplicationContainer";

export const AuthInfrastructureModule = () => {
  AuthApplicationModule();
  container.register<IUserRepository>(
    AUTH_INFRASTRUCTURE_TOKENS.IUserRepository,
    {
      useClass: UserRepository,
    }
  );

  container.register<IPasswordHasherServices>(
    AUTH_INFRASTRUCTURE_TOKENS.Argon2dPasswordHasherServices,
    {
      useClass: Argon2dHasherServices,
    }
  );
};
