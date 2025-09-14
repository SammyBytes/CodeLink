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
    