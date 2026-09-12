import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { FulfillmentController } from "./controllers/FulfillmentController.js";
import {
  fulfillmentIdSchema,
  getFulfillmentsQuerySchema,
  orderIdSchema,
  updateFulfillmentStatusSchema,
} from "./schemas/fulfillment.schemas.js";
import { authorize } from "../../middleware/authorize.js";
import { createAuthenticate } from "../auth/middleware/authenticate.js";
import { UserRepository } from "../users/repositories/UserRepository.js";
import { SessionRepository } from "../auth/repositories/SessionRepository.js";
import { pool } from "../../database/pool.js";
import { FulfillmentService } from "./services/FulfillmentService.js";
import { FulfillmentRepository } from "./repositories/FulfillmentRepository.js";
import { eventBus } from "../../infrastructure/events/eventBusInstance.js";

const router = Router();

const userRepository = new UserRepository(pool);
const sessionRepository = new SessionRepository(pool);
const fulfillmentRepository = new FulfillmentRepository(pool);

const fulfillmentService = new FulfillmentService(fulfillmentRepository, eventBus);

const fulfillmentController = new FulfillmentController(fulfillmentService);

const authenticate = createAuthenticate(sessionRepository, userRepository);

router.get(
  "/",
  authenticate,
  authorize("admin", "warehouse"),
  validate(getFulfillmentsQuerySchema, "query"),
  fulfillmentController.getFulfillments,
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "warehouse"),
  validate(fulfillmentIdSchema, "params"),
  fulfillmentController.getFulfillment,
);

router.get(
  "/order/:orderId",
  authenticate,
  authorize("admin", "warehouse"),
  validate(orderIdSchema, "params"),
  fulfillmentController.getFulfillmentByOrderId,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("admin", "warehouse"),
  validate(fulfillmentIdSchema, "params"),
  validate(updateFulfillmentStatusSchema, "body"),
  fulfillmentController.updateStatus,
);

export default router;
