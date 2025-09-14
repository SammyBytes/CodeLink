declare module "bun" {
  interface Env {
    TURSO_AUTH_TOKEN: string;
    TURSO_DATABASE_URL: string;
    REDIS_URL: string ;
    REDIS_USERNAME?: string;
    REDIS_PASSWORD?: string;
    JWT_SECRET: string;
    LOG_LEVEL?: string;
  }
}
