import { RedisClient } from "bun";

if (!Bun.env.REDIS_URL)
  throw new Error("REDIS_URL is not defined in environment variables");

const redisClient = new RedisClient(Bun.env.REDIS_URL, {
  autoReconnect: true,
});
export default redisClient;
