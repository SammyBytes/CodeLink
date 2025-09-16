import type { IProfileQueryRepository } from "@modules/Profile/core/repositories/IProfileQueryRepository";
import { filterTechProfilesSchema } from "@modules/Profile/core/validations/ProfileSchemas";
import { PROFILE_INFRASTRUCTURE_TOKENS } from "@modules/Profile/infrastructure/InfrastructureTokens";
import { Result } from "@shared/Result";
import { handleZodError } from "@shared/validations/FormatZodErrors";
import { log } from "app";

import { inject, injectable } from "tsyringe";

@injectable()
export class FilterProfilesUseCase {
  constructor(
    @inject(PROFILE_INFRASTRUCTURE_TOKENS.IProfileQueryRepository)
    private profileQueryRepository: IProfileQueryRepository
  ) {}

  async execute(input: unknown) {
    try {
      const { success, data, error } =
        await filterTechProfilesSchema.safeParseAsync(input);

      if (!success) {
        const { message } = handleZodError(error);
        log.error(`Validation error: ${message}`);
        return Result.fail(message);
      }

      const { page, limit, ...filters } = data;
      const pagination = page && limit ? { page, limit } : undefined;

      const profiles = await this.profileQueryRepository.findAllTech(
        filters,
        pagination
      );

      if (profiles.length === 0) {
        return Result.fail("No profiles found with the given criteria.");
      }

      return Result.ok(profiles);
    } catch (error) {
      log.error(`Unexpected error: ${(error as Error).message}`);
      return Result.fail("Error filtering profiles");
    }
  }
}
