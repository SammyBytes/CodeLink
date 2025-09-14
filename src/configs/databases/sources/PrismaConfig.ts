import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "generated/prisma";

if (!Bun.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL is not defined in environment variables");
}
if (!Bun.env.TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_AUTH_TOKEN is not defined in environment variables");
}

const adapter = new PrismaLibSQL({
  url: Bun.env.TURSO_DATABASE_URL,
  authToken: Bun.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });
export default prisma;
