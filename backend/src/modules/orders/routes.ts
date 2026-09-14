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
import { authorize } from "../../middleware/authorize.js";
import { eventBus } from "../../infrastructure/events/eventBusInstance.js";
import { OrderEventRepository } from "./events/OrderEventRepository.js";
import { OrderEventService } from "./services/OrderEventService.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

const orderRepository = new OrderRepository(pool);
const orderEventRepository = new OrderEventRepository(pool);

const orderService = new OrderService(orderRepository, eventBus);
const orderEventService = new OrderEventService(
  orderRepository,
  orderEventRepository,
);
const orderController = new OrderController(orderService, orderEventService);

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
  "/:id/events",
  authenticate,
  validate(orderIdSchema, "params"),
  orderController.getEvents,
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
