import pino, { Logger } from "pino";
import { injectable } from "tsyringe";

@injectable()
export class LoggerConfig {
  public log: Logger;

  constructor() {
    const isProd = Bun.env.NODE_ENV === "production";
    const level = Bun.env.LOG_LEVEL || (isProd ? "info" : "debug");

    this.log = pino(
      {
        level,
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          level: (label) => ({ level: label }), // Change "level" key to "level"
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
      this.log.error({ err }, "Uncaught Exception");
    });

    process.on("unhandledRejection", (reason) => {
      this.log.error({ reason }, "Unhandled Rejection");
    });
  }
}
