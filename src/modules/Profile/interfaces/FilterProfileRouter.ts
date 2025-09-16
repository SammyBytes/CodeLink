import { SessionMiddleware } from "@shared/validations/SessionMiddleware";
import { Hono } from "hono";
import { container } from "tsyringe";
import { jwt } from "hono/jwt";
import { publicRateLimit } from "@configs/honojs/config";
import { FilterProfilesUseCase } from "../application/useCases/FilterProfilesUseCase";
import { filterTechProfilesSchema } from "../core/validations/ProfileSchemas";
import { zValidationErrorHandler as zValidationErrorHandlerQuery } from "@shared/validations/ZodMiddleware";

export const FilterProfileRouter = new Hono();

FilterProfileRouter.use(
  "/*",
  jwt({
    secret: Bun.env.JWT_SECRET,
  })
);

FilterProfileRouter.get(
  "/tech",
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
