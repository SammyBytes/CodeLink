import "reflect-metadata";
import "@shared/di/Container";

import { Hono } from "hono";
import { logger } from "hono/logger";
import { AuthRouter } from "@modules/Auth/interfaces/router";
import { ProfileRouter } from "@modules/Profile/interfaces/ProfileRouter";
import { jwt, type JwtVariables } from "hono/jwt";
import { secureHeaders } from "hono/secure-headers";

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();
app.use("*", logger());
app.use(
  "*",
  secureHeaders({
    strictTransportSecurity: "max-age=63072000; includeSubDomains; preload",
    xFrameOptions: false,
    xXssProtection: "1; mode=block",
    xContentTypeOptions: false,
    contentSecurityPolicy: {
      scriptSrc: ["nonce"],
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    permissionsPolicy: {
      geolocation: false,
    },
  })
);
app.route("/api/v1/auth", AuthRouter);
app.route("/api/v1/profile", ProfileRouter);

app.notFound((c) => c.json({ message: "Not Found" }, 404));

app.onError((err, c) => {
  console.error("Stack trace:", err.stack);
  console.error(`Error occurred: ${err}`);
  return c.json({ message: "Internal Server Error" }, 500);
});

export default {
  fetch: app.fetch,
  port: 1234,
};
