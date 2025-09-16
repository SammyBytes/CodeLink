import { SessionMiddleware } from "@shared/validations/SessionMiddleware";
import { zValidationErrorHandler } from "@shared/validations/ZodMiddleware";
import { Hono } from "hono";
import { container } from "tsyringe";
import { updateProfileSchema } from "../core/validations/ProfileSchemas";
import { RegisterProfileUseCase } from "../application/useCases/RegisterProfileUseCase";
import { RetrieveProfileUseCase } from "../application/useCases/RetrieveProfileUseCase";
import { jwt } from "hono/jwt";
import { RetrieveProfileResponseDto } from "../application/dtos/RetrieveProfileResponseDto";
import { publicRateLimit } from "@configs/honojs/config";
import { FilterProfilesUseCase } from "../application/useCases/FilterProfilesUseCase";
import { filterTechProfilesSchema } from "../core/validations/ProfileSchemas";
import { zValidationErrorHandler as zValidationErrorHandlerQuery } from "@shared/validations/ZodMiddleware";

export const ProfileRouter = new Hono();

ProfileRouter.use(
  "/*",
  jwt({
    secret: Bun.env.JWT_SECRET,
  })
);

ProfileRouter.patch(
  "/",
  publicRateLimit,
  SessionMiddleware,
  zValidationErrorHandler("json", updateProfileSchema),
  async (c) => {
    const { userId } = c.get("Session");
    const data = await c.get("validatedData");

    const useCase = container.resolve<RegisterProfileUseCase>(
      RegisterProfileUseCase
    );
    const { success, message, profile } = await useCase.execute(userId, data);

    if (!success) {
      return c.json({ message }, 400);
    }

    if (!profile) {
      return c.json({ message: "Profile not found" }, 404);
    }

    const filteredProfile = RetrieveProfileResponseDto.fromDomain(profile!);
    return c.json({ message: "Profile updated", data: filteredProfile });
  }
);

ProfileRouter.get("/me", publicRateLimit, SessionMiddleware, async (c) => {
  const { userId } = c.get("Session");

  const useCase = container.resolve<RetrieveProfileUseCase>(
    RetrieveProfileUseCase
  );
  const { success, message, profile } = await useCase.execute(userId);

  if (!success) {
    return c.json({ message }, 400);
  }

  if (!profile) {
    return c.json({ message: "Profile not found" }, 404);
  }

  const filteredProfile = RetrieveProfileResponseDto.fromDomain(profile!);
  return c.json({ message: "Profile fetched", data: filteredProfile });
});

ProfileRouter.get("/:userId", publicRateLimit, SessionMiddleware, async (c) => {
  const { userId } = c.req.param();

  const useCase = container.resolve<RetrieveProfileUseCase>(
    RetrieveProfileUseCase
  );
  const { success, message, profile } = await useCase.execute(userId);

  if (!success) {
    return c.json({ message }, 400);
  }

  if (!profile) {
    return c.json({ message: "Profile not found" }, 404);
  }

  const filteredProfile = RetrieveProfileResponseDto.fromDomain(profile!);
  return c.json({ message: "Profile fetched", data: filteredProfile });
});

ProfileRouter.get(
  "/",
  publicRateLimit,
  SessionMiddleware,
  zValidationErrorHandlerQuery("query", filterTechProfilesSchema),
  async (c) => {
    const data = c.get("validatedData");

    const useCase = container.resolve<FilterProfilesUseCase>(
      FilterProfilesUseCase
    );
    const { isSuccess, error, value: profiles } = await useCase.execute(data);

    if (!isSuccess) {
      return c.json({ error }, 400);
    }

    return c.json({ message: "Profiles fetched", data: profiles });
  }
);
