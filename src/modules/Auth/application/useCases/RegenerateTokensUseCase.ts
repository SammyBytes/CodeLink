import { AUTH_INFRASTRUCTURE_TOKENS } from "@modules/Auth/infrastructure/InfrastructureTokens";
import type { ISessionService } from "../services/ISessionService";

import { inject, injectable } from "tsyringe";
import { refreshSessionSchema } from "@modules/Auth/core/validations/SessionSchemas";
import { handleZodError } from "@shared/validations/FormatZodErrors";
import { LoggerConfig } from "@configs/logger";
import { Result } from "@shared/Result";
import { IdGenerator } from "@shared/IdGenerator";
import { createJWT } from "../helpers/JwtHelper";

@injectable()
export class RegenerateTokensUseCase {
  constructor(
    @inject(AUTH_INFRASTRUCTURE_TOKENS.ISessionService)
    private sessionService: ISessionService,
    @inject(LoggerConfig) private logger: LoggerConfig
  ) {}

  async execute(input: unknown) {
    try {
      const { success, data, error } =
        await refreshSessionSchema.safeParseAsync(input);

      if (!success) {
        const { message } = handleZodError(error);
        this.logger.log.warn(
          `RegenerateTokensUseCase - Validation failed: ${message}`
        );
        return Result.fail(message);
      }

      const { userId, sessionId } =
        (await this.sessionService.findByRefreshToken(data.refreshToken)) || {};

      if (!userId || !sessionId) {
        this.logger.log.warn(
          `RegenerateTokensUseCase - Refresh token not found or invalid`
        );
        return Result.fail("Invalid refresh token");
      }

      // Validate session exists and is valid
      const isValid = await this.sessionService.validate(userId, sessionId);
      if (!isValid) {
        this.logger.log.warn(
          `RegenerateTokensUseCase - Invalid session: ${sessionId}`
        );
        return Result.fail("Invalid session");
      }

      await this.sessionService.revoke(sessionId);

      // Generate new tokens
      const newRefreshToken = IdGenerator.newId();
      const newSession = await this.sessionService.create(
        userId,
        newRefreshToken,
        7 * 24 * 60 * 60
      );
      // Create new access token
      const newAccessToken = await createJWT({
        userId,
        sessionId: newSession,
      });

      
      this.logger.log.info(
        `RegenerateTokensUseCase - Tokens regenerated for user: ${userId}, session: ${sessionId}`
      );

      return Result.ok({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      this.logger.log.error(`RegenerateTokensUseCase - Error: ${error}`);
      return Result.fail("Failed to regenerate tokens");
    }
  }
}
