import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "generated/prisma";

const adapter = new PrismaLibSQL({
  url: Bun.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });
export default prisma;
