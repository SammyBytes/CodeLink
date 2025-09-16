import pino, { Logger } from "pino";

export class LoggerConfig {
  private static _instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!this._instance) {
      const isProd = Bun.env.NODE_ENV === "production";
      const level = Bun.env.LOG_LEVEL || (isProd ? "info" : "debug");

      this._instance = pino(
        {
          level,
          timestamp: pino.stdTimeFunctions.isoTime,
          formatters: {
            level: (label) => ({ level: label }),
          },
        },
        isProd
          ? undefined
          : pino.transport({
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
              },
            })
      );

      process.on("uncaughtException", (err) => {
        this._instance.error({ err }, "Uncaught Exception");
      });

      process.on("unhandledRejection", (reason) => {
        this._instance.error({ reason }, "Unhandled Rejection");
      });
    }

    return this._instance;
  }
}
