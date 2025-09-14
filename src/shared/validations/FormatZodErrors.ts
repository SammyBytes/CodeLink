import { ZodError } from "zod";
import { FieldError } from "./interfaces/FieldError";
import { ValidationCodes } from "./enums/ValidationCodes";
import { ValidationMessages } from "./enums/ValidationMessages";
import { LoggerConfig } from "@configs/logger";

export function formatZodErrors(error: ZodError): FieldError[] {
  return error.issues.map((issue) => {
    let code: ValidationCodes;
    let message: string;

    switch (issue.code) {
      case "too_small":
        code = ValidationCodes.TOO_SHORT;
        message =
          typeof ValidationMessages[code] === "function"
            ? (ValidationMessages[code] as (limit?: number) => string)(
                typeof issue.minimum === "bigint"
                  ? Number(issue.minimum)
                  : issue.minimum
              )
            : (ValidationMessages[code] as string);
        break;

      case "too_big":
        code = ValidationCodes.TOO_LONG;
        message =
          typeof ValidationMessages[code] === "function"
            ? (ValidationMessages[code] as (limit?: number) => string)(
                typeof issue.maximum === "bigint"
                  ? Number(issue.maximum)
                  : issue.maximum
              )
            : (ValidationMessages[code] as string);
        break;

      case "invalid_type":
        code = ValidationCodes.INVALID_TYPE;
        message =
          typeof ValidationMessages[code] === "function"
            ? (ValidationMessages[code] as () => string)()
            : (ValidationMessages[code] as string);
        break;

      case "custom":
        if (issue.message.includes("email")) {
          code = ValidationCodes.INVALID_EMAIL;
          message =
            typeof ValidationMessages[code] === "function"
              ? (ValidationMessages[code] as () => string)()
              : (ValidationMessages[code] as string);
        } else {
          code = ValidationCodes.GENERIC;
          message =
            typeof issue.message === "string" && issue.message.length > 0
              ? issue.message
              : typeof ValidationMessages[code] === "function"
                ? (ValidationMessages[code] as () => string)()
                : (ValidationMessages[code] as string);
        }
        break;

      default:
        code = ValidationCodes.GENERIC;
        message =
          typeof ValidationMessages[code] === "function"
            ? (ValidationMessages[code] as () => string)()
            : (ValidationMessages[code] as string);
        break;
    }

    return {
      field: issue.path.join(".") || "unknown",
      message,
    };
  });
}

export function handleZodError(error: ZodError) {
  const errors = formatZodErrors(error);
  const messageStr = errors.map((e) => `${e.field}: ${e.message}`).join(", ");
  return { success: false, errors, message: messageStr };
}
