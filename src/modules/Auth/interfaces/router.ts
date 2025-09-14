// modules/Auth/infrastructure/routes/AuthRouter.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../core/validations/AuthSchemas";
import { container } from "tsyringe";
import { RegisterUseCase } from "../application/useCases/RegisterUseCase";
import { LoginUseCase } from "../application/useCases/LoginUseCase";
import { authRateLimit, publicRateLimit } from "@configs/honojs/config";
import { zValidationErrorHandler } from "@shared/validations/ZodMiddleware";
import { refreshSessionSchema } from "../core/validations/SessionSchemas";
import { RegenerateTokensUseCase } from "../application/useCases/RegenerateTokensUseCase";

export const AuthRouter = new Hono();

AuthRouter.post(
  "/register",
  authRateLimit,
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
  authRateLimit,
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

AuthRouter.post(
  "/refresh",
  authRateLimit,
  zValidationErrorHandler("json", refreshSessionSchema),
  async (c) => {
    try {
      const validated = c.get("validatedData");
      const regenerateTokens = container.resolve<RegenerateTokensUseCase>(
        RegenerateTokensUseCase
      );

      const tokensResult = await regenerateTokens.execute(validated);

      if (!tokensResult.isSuccess) {
        return c.json({ message: tokensResult.error }, 401);
      }

      return c.json({
        message: "Tokens regenerated",
        data: tokensResult.value,
      });
    } catch (err) {
      console.error("Refresh token error:", err);
      return c.json({ message: "Failed to regenerate tokens" }, 500);
    }
  }
);
