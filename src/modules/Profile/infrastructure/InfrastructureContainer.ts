import { container } from "tsyringe";
import type { IProfileRepository } from "@modules/Profile/core/repositories/IProfileRepository";
import { ProfileRepository } from "./repositories/ProfileRepository";
import { PROFILE_INFRASTRUCTURE_TOKENS } from "./InfrastructureTokens";
import { ProfileApplicationModule } from "../application/ApplicationContainer";
import { IProfileQueryRepository } from "../core/repositories/IProfileQueryRepository";
import { ProfileQueryRepository } from "./repositories/ProfileQueryRepository";

export const ProfileInfrastructureModule = () => {
  ProfileApplicationModule();
  container.register<IProfileRepository>(
    PROFILE_INFRASTRUCTURE_TOKENS.IProfileRepository,
    {
      useClass: ProfileRepository,
    }
  );
  container.register<IProfileQueryRepository>(
    PROFILE_INFRASTRUCTURE_TOKENS.IProfileQueryRepository,
    {
      useClass: ProfileQueryRepository,
    }
  );
};
