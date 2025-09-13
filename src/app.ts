import "reflect-metadata";
import "@shared/di/Container";

import { Hono } from "hono";
import { logger } from "hono/logger";
import { AuthRouter } from "@modules/Auth/interfaces/router";

const app = new Hono();
app.use("*", logger());

app.get("/", (c) => c.json({ message: "Welcome to CodeLink API" }));

app.route("/api/v1/auth", AuthRouter);

app.notFound((c) => c.json({ message: "Not Found" }, 404));

app.onError((err, c) => {
  console.error(`Error occurred: ${err}`);
  return c.json({ message: "Internal Server Error" }, 500);
});

export default {
  fetch: app.fetch,
  port: 1234,
};
