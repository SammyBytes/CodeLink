import { LoggerConfig } from "@configs/logger";
import { IUserEntity } from "@modules/Auth/core/models/IUserEntity";
import type { IUserRepository } from "@modules/Auth/core/repositories/IUserRepository";
import { loginSchema } from "@modules/Auth/core/validations/AuthSchemas";
import { Result } from "@shared/Result";
import { inject, injectable } from "tsyringe";
import type { IPasswordHasherServices } from "../services/IPasswordHasherServices";
import { AUTH_INFRASTRUCTURE_TOKENS } from "@modules/Auth/infrastructure/InfrastructureTokens";
import { handleZodError } from "@shared/validations/FormatZodErrors";

@injectable()
export class LoginUseCase {
  constructor(
    @inject(LoggerConfig) private logger: LoggerConfig,
    @inject(AUTH_INFRASTRUCTURE_TOKENS.IUserRepository)
    private userRepo: IUserRepository,
    @inject(AUTH_INFRASTRUCTURE_TOKENS.Argon2dPasswordHasherServices)
    private passwordHasher: IPasswordHasherServices
  ) {}

  async execute(input: unknown): Promise<Result<IUserEntity, string>> {
    try {
      const { success, data, error } = await loginSchema.safeParseAsync(input);
      if (!success) {
        const message = handleZodError(error).message;
        this.logger.logger.warn({ message }, "Validation failed");
        return Result.fail(message);
      }

      const user = await this.userRepo.findByEmail(data.email);
      if (!user) {
        const message = "User not found";
        this.logger.logger.warn({ email: data.email }, message);
        return Result.fail(message);
      }

      if (!user.password) {
        const message = "User has no password set";
        this.logger.logger.warn({ email: data.email }, message);
        return Result.fail(message);
      }

      const valid = await this.passwordHasher.compare(
        data.password,
        user.password
      );

      if (!valid) {
        const message = "Invalid credentials";
        this.logger.logger.warn({ email: data.email }, message);
        return Result.fail(message);
      }

      return Result.ok(user);
    } catch (error) {
      this.logger.logger.error({ error }, "Login failed");
      return Result.fail("Login failed");
    }
  }
}
