import { Router } from "express";
import { pool } from "../../database/index.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import {
  getNotificationsQuerySchema,
  notificationIdSchema,
} from "./schemas/notification.schemas.js";
import { NotificationController } from "./controllers/NotificationController.js";
import { NotificationRepository } from "./repositories/NotificationRepository.js";
import { NotificationService } from "./services/NotificationService.js";

const router = Router();
const notificationRepository = new NotificationRepository(pool);
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.get(
  "/",
  authenticate,
  validate(getNotificationsQuerySchema, "query"),
  notificationController.getAll,
);

router.get(
  "/unread-count",
  authenticate,
  notificationController.getUnreadCount,
);

router.patch("/read-all", authenticate, notificationController.markAllAsRead);

router.patch(
  "/:id/read",
  authenticate,
  validate(notificationIdSchema, "params"),
  notificationController.markAsRead,
);

export default router;
