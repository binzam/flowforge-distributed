import { redisClient } from "./redisClient.js";

redisClient.on("error", (error) => {
  console.error("Redis client error:", error);
});
