import { LoggerConfig } from "@configs/logger";
import { IUserEntity } from "@modules/Auth/core/models/IUserEntity";
import type { IUserRepository } from "@modules/Auth/core/repositories/IUserRepository";
import { loginSchema } from "@modules/Auth/core/validations/AuthSchemas";
import { Result } from "@shared/Result";
import { inject, injectable } from "tsyringe";
import type { IPasswordHasherServices } from "../services/IPasswordHasherServices";
import { AUTH_INFRASTRUCTURE_TOKENS } from "@modules/Auth/infrastructure/InfrastructureTokens";
import { handleZodError } from "@shared/validations/FormatZodErrors";

import type { ISessionService } from "@modules/Auth/application/services/ISessionService";
import { createJWT } from "../helpers/JwtHelper";
import { UserLoginResponseDTO } from "../dtos/UserLoginResponseDTO";
import { IdGenerator } from "@shared/IdGenerator";
import { log } from "app";

@injectable()
export class LoginUseCase {
  constructor(
    @inject(AUTH_INFRASTRUCTURE_TOKENS.IUserRepository)
    private userRepo: IUserRepository,
    @inject(AUTH_INFRASTRUCTURE_TOKENS.Argon2dPasswordHasherServices)
    private passwordHasher: IPasswordHasherServices,
    @inject(AUTH_INFRASTRUCTURE_TOKENS.ISessionService)
    private sessionService: ISessionService
  ) {}

  async execute(input: unknown): Promise<Result<UserLoginResponseDTO, string>> {
    try {
      const { success, data, error } = await loginSchema.safeParseAsync(input);
      if (!success) {
        const message = handleZodError(error).message;
        log.warn({ message }, "Validation failed");
        return Result.fail(message);
      }

      const user = await this.userRepo.findByEmail(data.email);
      if (!user || !user.password) {
        return Result.fail("Invalid credentials");
      }

      const valid = await this.passwordHasher.compare(
        data.password,
        user.password
      );
      if (!valid) {
        return Result.fail("Invalid credentials");
      }

      // Generate session
      const refreshToken = IdGenerator.newId();
      const sessionId = await this.sessionService.create(
        user.userId,
        refreshToken,
        7 * 24 * 60 * 60 // 7 days
      );

      // Generate JWT (access token)
      const accessToken = await createJWT({ userId: user.userId, sessionId });

      return Result.ok({ accessToken, refreshToken });
    } catch (err) {
      log.error(
        {
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        },
        "Login failed"
      );
      return Result.fail("Login failed");
    }
  }
}
