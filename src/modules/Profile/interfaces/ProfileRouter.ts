import { SessionMiddleware } from "@shared/validations/SessionMiddleware";
import { zValidationErrorHandler } from "@shared/validations/ZodMiddleware";
import { Hono } from "hono";
import { container } from "tsyringe";
import { updateProfileSchema } from "../core/validations/ProfileSchemas";
import { RegisterProfileUseCase } from "../application/useCases/RegisterProfileUseCase";
import { RetrieveProfileUseCase } from "../application/useCases/RetrieveProfileUseCase";
import { jwt } from "hono/jwt";
import { RetrieveProfileResponseDto } from "../application/dtos/RetrieveProfileResponseDto";

export const ProfileRouter = new Hono();

ProfileRouter.use(
  "/*",
  jwt({
    secret: Bun.env.JWT_SECRET,
  })
);

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

    const filteredProfile = RetrieveProfileResponseDto.fromDomain(profile!);

    if (success) {
      return c.json({ message: "Profile updated", data: filteredProfile });
    } else {
      return c.json({ message }, 400);
    }
  }
);

ProfileRouter.get("/me", SessionMiddleware, async (c) => {
  const { userId } = c.get("Session");

  const useCase = container.resolve<RetrieveProfileUseCase>(
    RetrieveProfileUseCase
  );
  const { success, message, profile } = await useCase.execute(userId);

  const filteredProfile = RetrieveProfileResponseDto.fromDomain(profile!);

  if (success) {
    return c.json({ message: "Profile fetched", data: filteredProfile });
  } else {
    return c.json({ message }, 400);
  }
});

ProfileRouter.get("/:userId", SessionMiddleware, async (c) => {
  const { userId } = c.req.param();

  const useCase = container.resolve<RetrieveProfileUseCase>(
    RetrieveProfileUseCase
  );
  const { success, message, profile } = await useCase.execute(userId);

  const filteredProfile = RetrieveProfileResponseDto.fromDomain(profile!);

  if (success) {
    return c.json({ message: "Profile fetched", data: filteredProfile });
  } else {
    return c.json({ message }, 400);
  }
});
