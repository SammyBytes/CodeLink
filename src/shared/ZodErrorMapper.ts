import { ZodError } from "zod";

export function formatZodErrors(error: ZodError) {
  const missingFields = error.issues
    .filter(
      (issue) => issue.code === "invalid_type" || issue.code === "too_small"
    )
    .map((issue) => issue.path.join("."));

  if (missingFields.length > 0) {
    return `Missing or invalid fields: ${missingFields.join(", ")}`;
  }

  return error.issues.map((i) => i.message).join(", ");
}
