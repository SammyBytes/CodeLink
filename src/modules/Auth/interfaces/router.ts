// modules/Auth/infrastructure/routes/AuthRouter.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../core/validations/AuthSchemas";
import { container } from "tsyringe";
import { RegisterUseCase } from "../application/useCases/RegisterUseCase";
import { LoginUseCase } from "../application/useCases/LoginUseCase";
import { publicRateLimit } from "@configs/honojs/config";
import { zValidationErrorHandler } from "@shared/validations/ZodMiddleware";

export const AuthRouter = new Hono();

AuthRouter.post(
  "/register",
  publicRateLimit,
  zValidationErrorHandler("form", registerSchema),
  async (c) => {
    const validated = c.get("validatedData");
    const registerUseCase = container.resolve<RegisterUseCase>(RegisterUseCase);
    const result = await registerUseCase.execute(validated);

    if (result.isSuccess) {
      return c.json({ message: "Registration successful", data: result.value });
    } else {
      return c.json({ message: result.error }, 400);
    }
  }
);

AuthRouter.post(
  "/login",
  publicRateLimit,
  zValidationErrorHandler("form", loginSchema),
  async (c) => {
    const validated = c.get("validatedData");
    const loginUseCase = container.resolve<LoginUseCase>(LoginUseCase);
    const result = await loginUseCase.execute(validated);

    if (result.isSuccess) {
      return c.json({ message: "Login successful", data: result.value });
    } else {
      return c.json({ message: result.error }, 400);
    }
  }
);
