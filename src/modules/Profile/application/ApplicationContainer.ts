import { container } from "tsyringe";
import { PROFILE_APPLICATION_TOKENS } from "./ApplicationTokens";
import { RegisterProfileUseCase } from "./useCases/RegisterProfileUseCase";

export const ProfileApplicationModule = () => {
  container.register(PROFILE_APPLICATION_TOKENS.RegisterProfileUseCase, {
    useClass: RegisterProfileUseCase,
  });
};
