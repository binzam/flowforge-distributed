import app from "./app.js";
import http from "node:http";
import { pool } from "./database/index.js";
import { config } from "./config/env.js";
import { registerEventHandlers } from "./bootstrap/registerEventHandlers.js";
import { redisClient } from "./infrastructure/redis/redisClient.js";
import { initializeWebSocketServer } from "./infrastructure/websocket/index.js";
import { KafkaConsumer } from "./infrastructure/kafka/KafkaConsumer.js";

const startServer = async () => {
  try {
    const httpServer = http.createServer(app);

    // PostgreSQL
    await pool.query("SELECT 1");
    console.log("Database connection successful");

    // Redis
    await redisClient.connect();
    console.log("Redis connection successful");

    // WebSocket
    const websocketServer = initializeWebSocketServer(httpServer);
    registerEventHandlers(websocketServer);

    // Kafka
    const kafkaConsumer = new KafkaConsumer("flowforge-api");

    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe("flowforge.events");

    void kafkaConsumer.run(async (message) => {
      console.log("Kafka message received:", message);
    });

    console.log("Kafka consumer connected");

    // HTTP server
    httpServer.listen(config.port, () => {
      console.log(`FlowForge API running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start FlowForge:", error);
    process.exit(1);
  }
};

startServer();
