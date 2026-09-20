import app from "./app.js";
import http from "node:http";
import { pool } from "./database/index.js";
import { config } from "./config/env.js";
import { registerEventHandlers } from "./bootstrap/registerEventHandlers.js";
import { redisClient } from "./infrastructure/redis/redisClient.js";
import { initializeWebSocketServer } from "./infrastructure/websocket/index.js";

const startServer = async () => {
  try {
    const httpServer = http.createServer(app);
    await pool.query("SELECT 1");

    console.log("Database connection successful");

    await redisClient.connect();
    console.log("Redis connection successful");

    const websocketServer = initializeWebSocketServer(httpServer);
    registerEventHandlers(websocketServer);
    httpServer.listen(config.port, () => {
      console.log(`FlowForge API running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start FlowForge:", error);
    process.exit(1);
  }
};

startServer();
