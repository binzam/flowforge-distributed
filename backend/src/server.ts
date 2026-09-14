import app from "./app.js";
import { pool } from "./database/index.js";
import { config } from "./config/env.js";
import { registerEventHandlers } from "./bootstrap/registerEventHandlers.js";
import { redisClient } from "./infrastructure/redis/redisClient.js";

const startServer = async () => {
  try {
    await pool.query("SELECT 1");

    console.log("Database connection successful");

    await redisClient.connect();
    console.log("Redis connection successful");

    registerEventHandlers();
    app.listen(config.port, () => {
      console.log(`FlowForge API running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start FlowForge:", error);
    process.exit(1);
  }
};

startServer();
