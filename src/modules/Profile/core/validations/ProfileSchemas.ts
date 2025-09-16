import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  country: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().optional(),
  languages: z.array(z.string()),
  frameworks: z.array(z.string()),
  tools: z.array(z.string()),
});

/**
 * Zod schema for filtering technology profiles.
 *
 * This schema validates the structure of filter objects used to query tech profiles.
 *
 * @property {string[]} [stack] - Optional array of technology stack names to filter by.
 * @property {string[]} [skills] - Optional array of skill names to filter by.
 * @property {string[]} [projects] - Optional array of project identifiers to filter by.
 * @property {number} [page] - Optional page number for pagination (minimum value: 1).
 * @property {number} [limit] - Optional maximum number of results per page (minimum: 1, maximum: 100).
 */
export const filterTechProfilesSchema = z.object({
  languages: z.preprocess((val) => {
    if (!val) return undefined;
    return Array.isArray(val) ? val : [val];
  }, z.array(z.string()).optional()),
  tools: z.preprocess((val) => {
    if (!val) return undefined;
    return Array.isArray(val) ? val : [val];
  }, z.array(z.string()).optional()),
  frameworks: z.preprocess((val) => {
    if (!val) return undefined;
    return Array.isArray(val) ? val : [val];
  }, z.array(z.string()).optional()),
  page: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().min(1).optional()
  ),
  limit: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().min(1).max(100).optional()
  ),
});
