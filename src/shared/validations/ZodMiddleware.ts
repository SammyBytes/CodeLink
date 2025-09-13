import { Context, MiddlewareHandler, ValidationTargets } from "hono";
import { FieldError } from "./interfaces/FieldError";
import { ZodSchema } from "zod";
import { formatZodErrors } from "./FormatZodErrors";

export type ValidationEnvironment<T = unknown> = {
  Variables: {
    validatedData: T;
  };
};
/**
 * Zod validation error handler middleware.
 * @param type - The type of validation (e.g., "json", "query", etc.).
 * @param schema - The Zod schema to validate against.
 * @returns A middleware handler for Hono.
 */
export const zValidationErrorHandler =
  <S extends ZodSchema, T extends keyof ValidationTargets>(
    type: T,
    schema: S
  ): MiddlewareHandler<ValidationEnvironment<ReturnType<S["parse"]>>> =>
  async (c: Context, next) => {
    let data: unknown;

    switch (type) {
      case "json":
        data = await c.req.json();
        break;
      case "query":
        data = c.req.query();
        break;
      case "form":
        data = await c.req.parseBody();
        break;
      case "header":
        data = c.req.header;
        break;
      case "param":
        data = c.req.param();
        break;
      default:
        data = undefined;
    }

    const result = schema.safeParse(data);

    if (!result.success) {
      const errors: FieldError[] = formatZodErrors(result.error);
      return c.json({ message: "Validation error", errors }, 400);
    }

    c.set("validatedData", result.data);
    await next();
  };
