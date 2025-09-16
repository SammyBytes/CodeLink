import z from "zod";

const enviromentsVariables = z.object({
  REDIS_HOST: z.string().min(1).default("localhost"),
  REDIS_PASSWORD: z.string(),
  REDIS_USERNAME: z.string().min(1),
  REDIS_PORT: z.coerce.number().default(6379),
  JWT_SECRET: z.string().min(1).default("secret"),
  LOG_LEVEL: z.string().default("debug"),
  TURSO_AUTH_TOKEN: z.string().min(8).default("your-token"),
  TURSO_DATABASE_URL: z.string().min(1).default("https://tursodb.com"),
});

const { success, data, error } = enviromentsVariables.safeParse(Bun.env);

if (!success) {
  console.error("Invalid environment variables:", error);
  throw new Error("Invalid environment variables");
}

export const {
  JWT_SECRET,
  LOG_LEVEL,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_HOST,
  REDIS_USERNAME,
  TURSO_AUTH_TOKEN,
  TURSO_DATABASE_URL,
} = data;
