import app from "./app.js";
import { pool } from "./database/index.js";
import { config } from "./config/env.js";

const startServer = async () => {
  try {
    await pool.query("SELECT 1");

    console.log("Database connection successful");

    app.listen(config.port, () => {
      console.log(`FlowForge API running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

startServer();
