import { ValidationCodes } from "./ValidationCodes";

export const ValidationMessages: Record<
  ValidationCodes,
  string | ((limit?: number | BigInt) => string)
> = {
  [ValidationCodes.REQUIRED]: "This field is required",
  [ValidationCodes.INVALID_EMAIL]: "Invalid email address",
  [ValidationCodes.TOO_SHORT]: (limit) =>
    `Value must be at least ${limit} characters`,
  [ValidationCodes.TOO_LONG]: (limit) =>
    `Value must be at most ${limit} characters`,
  [ValidationCodes.INVALID_TYPE]: "Invalid data type",
  [ValidationCodes.GENERIC]: "Invalid value",
};
