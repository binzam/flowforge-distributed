import { createClient } from "redis";
import { config } from "../../config/env.js";

export const redisClient = createClient({
  url: config.redis.url,
});
