import { AUTH_APPLICATION_TOKENS } from "./ApplicationTokens";
import { LoginUseCase } from "./useCases/LoginUseCase";
import { RegisterUseCase } from "./useCases/RegisterUseCase";

import { container } from "tsyringe";

export const AuthApplicationModule = () => {
  container.register<LoginUseCase>(AUTH_APPLICATION_TOKENS.LoginUseCase, {
    useClass: LoginUseCase,
  });
  container.register<RegisterUseCase>(AUTH_APPLICATION_TOKENS.RegisterUseCase, {
    useClass: RegisterUseCase,
  });
};
