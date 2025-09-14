import { LoggerConfig } from "@configs/logger";
import { ProfileEntity } from "@modules/Profile/core/entities/ProflieEntity";
import type { IProfileRepository } from "@modules/Profile/core/repositories/IProfileRepository";
import { updateProfileSchema } from "@modules/Profile/core/validations/ProfileSchemas";
import { PROFILE_INFRASTRUCTURE_TOKENS } from "@modules/Profile/infrastructure/InfrastructureTokens";
import { handleZodError } from "@shared/validations/FormatZodErrors";

import { inject, injectable } from "tsyringe";

@injectable()
export class RegisterProfileUseCase {
  constructor(
    @inject(LoggerConfig) private logger: LoggerConfig,
    @inject(PROFILE_INFRASTRUCTURE_TOKENS.IProfileRepository)
    private profileRepo: IProfileRepository
  ) {}

  async execute(userId: string, input: unknown) {
    try {
      const existingProfile = await this.profileRepo.findByUserId(userId);
      if (existingProfile) {
        const message = `Profile for user ${userId} already exists`;
        this.logger.log.warn({ userId }, message);
        return { success: false, message };
      }

      const parsed = await updateProfileSchema.safeParseAsync(input);
      if (!parsed.success) {
        const message = handleZodError(parsed.error).message;
        this.logger.log.warn({ userId, input }, message);
        return { success: false, message };
      }

      const data = { ...parsed.data, userId };
      const entity = ProfileEntity.createNew({
        ...data,
      });

      const created = await this.profileRepo.create(entity);

      return { success: true, profile: created };
    } catch (error) {
      this.logger.log.error(
        { error, userId, input },
        "Error occurred during profile registration"
      );
      return { success: false, message: "Internal server error" };
    }
  }
}
