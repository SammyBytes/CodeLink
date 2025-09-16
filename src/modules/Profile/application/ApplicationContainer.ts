import { container } from "tsyringe";
import { PROFILE_APPLICATION_TOKENS } from "./ApplicationTokens";
import { RegisterProfileUseCase } from "./useCases/RegisterProfileUseCase";
import { RetrieveProfileUseCase } from "./useCases/RetrieveProfileUseCase";
import { FilterProfilesUseCase } from "./useCases/FilterProfilesUseCase";

export const ProfileApplicationModule = () => {
  container.register(PROFILE_APPLICATION_TOKENS.RegisterProfileUseCase, {
    useClass: RegisterProfileUseCase,
  });
  container.register(PROFILE_APPLICATION_TOKENS.RetrieveProfileUseCase, {
    useClass: RetrieveProfileUseCase,
  });

  container.register(PROFILE_APPLICATION_TOKENS.FilterProfilesUseCase, {
    useClass: FilterProfilesUseCase,
  });
};
