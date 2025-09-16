import { createClient } from "@libsql/client";

if (!Bun.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL is not defined in environment variables");
}
if (!Bun.env.TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_AUTH_TOKEN is not defined in environment variables");
}

export const turso = createClient({
  url: Bun.env.TURSO_DATABASE_URL,
  authToken: Bun.env.TURSO_AUTH_TOKEN,
});
