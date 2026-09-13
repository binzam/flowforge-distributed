import { Router } from "express";
import { pool } from "../../database/index.js";
import { OrderController } from "./controllers/OrderController.js";
import { OrderRepository } from "./repositories/OrderRepository.js";
import { OrderService } from "./services/OrderService.js";
import {
  createOrderSchema,
  getMyOrdersQuerySchema,
  getOrdersQuerySchema,
  orderIdSchema,
  updateOrderStatusSchema,
} from "./schemas/order.schemas.js";
import { validate } from "../../middleware/validate.js";
import { UserRepository } from "../users/repositories/UserRepository.js";
import { SessionRepository } from "../auth/repositories/SessionRepository.js";
import { createAuthenticate } from "../auth/middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { eventBus } from "../../infrastructure/events/eventBusInstance.js";

const router = Router();

const orderRepository = new OrderRepository(pool);
const orderService = new OrderService(orderRepository, eventBus);
const orderController = new OrderController(orderService);

const userRepository = new UserRepository(pool);
const sessionRepository = new SessionRepository(pool);
const authenticate = createAuthenticate(sessionRepository, userRepository);

router.post(
  "/",
  authenticate,
  validate(createOrderSchema),
  orderController.create,
);

router.get(
  "/mine",
  authenticate,
  validate(getMyOrdersQuerySchema, "query"),
  orderController.getMine,
);

router.get(
  "/",
  authenticate,
  authorize("admin", "warehouse"),
  validate(getOrdersQuerySchema, "query"),
  orderController.getAll,
);

router.get(
  "/:id",
  authenticate,
  validate(orderIdSchema, "params"),
  orderController.getById,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("admin", "warehouse"),
  validate(orderIdSchema, "params"),
  validate(updateOrderStatusSchema),
  orderController.updateStatus,
);

router.post("/:id/cancel", authenticate, orderController.cancelOrder);

export default router;
