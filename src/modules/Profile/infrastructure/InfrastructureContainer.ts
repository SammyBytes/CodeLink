import { container } from "tsyringe";
import type { IProfileRepository } from "@modules/Profile/core/repositories/IProfileRepository";
import { ProfileRepository } from "./repositories/ProfileRepository";
import { PROFILE_INFRASTRUCTURE_TOKENS } from "./InfrastructureTokens";
import { ProfileApplicationModule } from "../application/ApplicationContainer";

export const ProfileInfrastructureModule = () => {
  ProfileApplicationModule();
  container.register<IProfileRepository>(
    PROFILE_INFRASTRUCTURE_TOKENS.IProfileRepository,
    {
      useClass: ProfileRepository,
    }
  );
};
