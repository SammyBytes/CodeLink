declare module "bun" {
  interface Env {
    TURSO_AUTH_TOKEN: string;
    TURSO_DATABASE_URL: string;
  }
}
