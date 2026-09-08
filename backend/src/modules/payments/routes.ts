import { Router, raw } from "express";
import { pool } from "../../database/index.js";
import { PaymentController } from "./controllers/PaymentController.js";
import { PaymentRepository } from "./repositories/PaymentRepository.js";
import { PaymentService } from "./services/PaymentService.js";
import { ChapaProvider } from "../../infrastructure/payments/ChapaProvider.js";
import {
  chapaCallbackQuerySchema,
  initializePaymentSchema,
  paymentOrderIdParamSchema,
} from "./schemas/payment.schemas.js";
import { validate } from "../../middleware/validate.js";
import { OrderRepository } from "../orders/repositories/OrderRepository.js";
import { OrderService } from "../orders/services/OrderService.js";
import { UserRepository } from "../users/repositories/UserRepository.js";
import { SessionRepository } from "../auth/repositories/SessionRepository.js";
import { createAuthenticate } from "../auth/middleware/authenticate.js";

const chapaSecretKey = process.env.CHAPA_SECRET_KEY;
if (!chapaSecretKey) {
  throw new Error("CHAPA_SECRET_KEY environment variable is required");
}

const chapaWebhookSecret = process.env.CHAPA_WEBHOOK_SECRET;
if (!chapaWebhookSecret) {
  throw new Error("CHAPA_WEBHOOK_SECRET environment variable is required");
}

const frontendBaseUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:5000";

const paymentProvider = new ChapaProvider(chapaSecretKey, chapaWebhookSecret);

const paymentRepository = new PaymentRepository(pool);
const orderRepository = new OrderRepository(pool);
const orderService = new OrderService(orderRepository);

const paymentService = new PaymentService(
  paymentRepository,
  orderRepository,
  orderService,
  paymentProvider,
  frontendBaseUrl,
  apiBaseUrl,
);

const paymentController = new PaymentController(
  paymentService,
  paymentProvider,
);

const userRepository = new UserRepository(pool);
const sessionRepository = new SessionRepository(pool);
const authenticate = createAuthenticate(sessionRepository, userRepository);

const router = Router();

router.post(
  "/initialize",
  authenticate,
  validate(initializePaymentSchema),
  paymentController.initialize,
);

router.get(
  "/orders/:orderId",
  authenticate,
  validate(paymentOrderIdParamSchema, "params"),
  paymentController.getByOrderId,
);

router.get(
  "/callback",
  validate(chapaCallbackQuerySchema, "query"),
  paymentController.callback,
);

export default router;

export const paymentsWebhookMiddleware = [
  raw({ type: "application/json" }),
  paymentController.webhook,
] as const;
