import pino, { Logger } from "pino";
import { injectable } from "tsyringe";

@injectable()
export class LoggerConfig {
  public logger: Logger;

  constructor() {
    this.logger = this.getLogger();
  }

  private getLogger(): Logger {
    if (!this.logger) {
      const isProd = Bun.env.NODE_ENV === "production";
      const level = Bun.env.LOG_LEVEL || (isProd ? "info" : "debug");

      this.logger = pino(
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
        this.logger.error({ err }, "Uncaught Exception");
      });

      process.on("unhandledRejection", (reason) => {
        this.logger.error({ reason }, "Unhandled Rejection");
      });
    }

    return this.logger;
  }
}
