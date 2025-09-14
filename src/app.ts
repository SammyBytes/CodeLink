import "reflect-metadata";
import "@shared/di/Container";

import { Hono } from "hono";
import { logger } from "hono/logger";
import { AuthRouter } from "@modules/Auth/interfaces/router";
import { ProfileRouter } from "@modules/Profile/interfaces/ProfileRouter";
import { jwt, type JwtVariables } from "hono/jwt";

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();
app.use("*", logger());
// app.use(
//   "/profile/*",
//   jwt({
//     secret: Bun.env.JWT_SECRET,
//   })
// );
app.route("/api/v1/auth", AuthRouter);
app.route("/api/v1/profile", ProfileRouter);

app.notFound((c) => c.json({ message: "Not Found" }, 404));

app.onError((err, c) => {
  console.error(`Error occurred: ${err}`);
  return c.json({ message: "Internal Server Error" }, 500);
});

export default {
  fetch: app.fetch,
  port: 1234,
};
