import app from "./app.js";
import { pool } from "./database/index.js";
import { config } from "./config/env.js";
import { registerEventHandlers } from "./bootstrap/registerEventHandlers.js";
import { rabbitMQConnection } from "./infrastructure/messaging/rabbitMQConnectionInstance.js";

const startServer = async () => {
  try {
    await pool.query("SELECT 1");

    console.log("Database connection successful");

    await rabbitMQConnection.connect();

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
