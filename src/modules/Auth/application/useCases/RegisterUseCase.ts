import { IUserEntity } from "@modules/Auth/core/models/IUserEntity";
import { registerSchema } from "@modules/Auth/core/validations/AuthSchemas";
import type { IUserRepository } from "@modules/Auth/core/repositories/IUserRepository";
import type { IPasswordHasherServices } from "@modules/Auth/application/services/IPasswordHasherServices";
import { inject, injectable } from "tsyringe";
import { Result } from "@shared/Result";
import { LoggerConfig } from "@configs/logger";
import { UserEntity } from "@modules/Auth/core/entities/UserEntity";
import { AUTH_INFRASTRUCTURE_TOKENS } from "@modules/Auth/infrastructure/InfrastructureTokens";
import {
  formatZodErrors,
  handleZodError,
} from "@shared/validations/FormatZodErrors";
import { IdGenerator } from "@shared/IdGenerator";

@injectable()
export class RegisterUseCase {
  constructor(
    @inject(AUTH_INFRASTRUCTURE_TOKENS.IUserRepository)
    private userRepo: IUserRepository,
    @inject(AUTH_INFRASTRUCTURE_TOKENS.Argon2dPasswordHasherServices)
    private passwordHasher: IPasswordHasherServices,
    @inject(LoggerConfig) private logger: LoggerConfig
  ) {}

  async execute(input: unknown): Promise<Result<IUserEntity, string>> {
    try {
      const data = await registerSchema.safeParseAsync(input);
      if (!data.success) {
        const message = handleZodError(data.error).message;
        this.logger.logger.warn({ message }, "Validation failed");
        return Result.fail(message);
      }

      const existingUser = await this.userRepo.findByEmail(data.data.email);
      if (existingUser) {
        const message = `Email ${data.data.email} is already in use`;
        this.logger.logger.warn({ email: data.data.email }, message);
        return Result.fail(message);
      }

      const hashedPassword = await this.passwordHasher.hash(data.data.password);
      const user: IUserEntity = UserEntity.createNew(
        IdGenerator.newId(),
        data.data.email,
        data.data.username,
        hashedPassword
      );
      return Result.ok(await this.userRepo.create(user));
    } catch (error) {
      this.logger.logger.error({ error }, "Error occurred during registration");
      return Result.fail("Internal server error");
    }
  }
}
