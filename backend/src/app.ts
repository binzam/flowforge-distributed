import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config/env.js";
import { errorHandler } from "./errors/errorHandler.js";
import userRoutes from "./modules/users/routes.js";
import authRoutes from "./modules/auth/routes.js";
import productRoutes from "./modules/products/routes.js";
import orderRoutes from "./modules/orders/routes.js";
import paymentsRoutes, {
  paymentsWebhookMiddleware,
} from "./modules/payments/routes.js";

const app = express();
app.post("/payments/webhook", ...paymentsWebhookMiddleware);

app.use(
  cors({
    origin: config.frontend.url,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentsRoutes);

app.use(errorHandler);

export default app;
