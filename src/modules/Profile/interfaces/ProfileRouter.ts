import { SessionMiddleware } from "@shared/validations/SessionMiddleware";
import { zValidationErrorHandler } from "@shared/validations/ZodMiddleware";
import { Hono } from "hono";
import { container } from "tsyringe";
import { updateProfileSchema } from "../core/validations/ProfileSchemas";
import { RegisterProfileUseCase } from "../application/useCases/RegisterProfileUseCase";

export const ProfileRouter = new Hono();

ProfileRouter.patch(
  "/",
  SessionMiddleware,
  zValidationErrorHandler("json", updateProfileSchema),
  async (c) => {
    const { userId } = c.get("Session");
    const data = await c.req.json();

    const useCase = container.resolve<RegisterProfileUseCase>(
      RegisterProfileUseCase
    );
    const { success, message, profile } = await useCase.execute(userId, data);

    if (success) {
      return c.json({ message: "Profile updated", data: profile });
    } else {
      return c.json({ message }, 400);
    }
  }
);

ProfileRouter.get("/", SessionMiddleware, async (c) => {
  const { userId } = c.get("Session");

  const useCase = container.resolve<RegisterProfileUseCase>(
    RegisterProfileUseCase
  );
  const { success, message, profile } = await useCase.execute(userId, {});

  if (success) {
    return c.json({ message: "Profile fetched", data: profile });
  } else {
    return c.json({ message }, 400);
  }
});
