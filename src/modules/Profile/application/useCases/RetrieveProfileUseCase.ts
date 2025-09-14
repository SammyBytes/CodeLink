import { LoggerConfig } from "@configs/logger";
import type { IProfileRepository } from "@modules/Profile/core/repositories/IProfileRepository";
import { PROFILE_INFRASTRUCTURE_TOKENS } from "@modules/Profile/infrastructure/InfrastructureTokens";

import { inject, injectable } from "tsyringe";

@injectable()
export class RetrieveProfileUseCase {
  constructor(
    @inject(PROFILE_INFRASTRUCTURE_TOKENS.IProfileRepository)
    private profileRepo: IProfileRepository,
    @inject(LoggerConfig) private logger: LoggerConfig
  ) {}

  async execute(userId: string) {
    try {
      const profile = await this.profileRepo.findByUserId(userId);
      if (!profile) {
        this.logger.log.warn({ userId }, "Profile not found");
        return { success: false, message: "Profile not found" };
      }
      return { success: true, profile };
    } catch (error) {
      this.logger.log.error({ error }, "Error retrieving profile");
      return { success: false, message: "Internal server error" };
    }
  }
}
