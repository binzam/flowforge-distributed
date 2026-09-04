import express from "express";
import { errorHandler } from "./errors/errorHandler.js";
import userRoutes from "./modules/users/routes.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/users", userRoutes);
app.use(errorHandler);

export default app;
