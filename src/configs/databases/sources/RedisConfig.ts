import {
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_HOST,
  REDIS_USERNAME,
} from "@configs/env/Env";
import Redis from "ioredis";

const redisClient = new Redis({
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
  username: REDIS_USERNAME,
  port: REDIS_PORT,
});

redisClient.on("error", (err) => {
  console.error("[ioredis] Error event:", err);
});
export default redisClient;
