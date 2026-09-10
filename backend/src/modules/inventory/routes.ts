import { Router } from "express";
import { pool } from "../../database/index.js";
import { validate } from "../../middleware/validate.js";
import { UserRepository } from "../users/repositories/UserRepository.js";
import { SessionRepository } from "../auth/repositories/SessionRepository.js";
import { createAuthenticate } from "../auth/middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import {
  createInventorySchema,
  getInventoriesQuerySchema,
  inventoryProductIdParamSchema,
  updateInventorySchema,
} from "./schemas/inventory.schemas.js";
import { InventoryRepository } from "./repositories/InventoryRepository.js";
import { InventoryService } from "./services/InventoryService.js";
import { InventoryController } from "./controllers/InventoryController.js";

const router = Router();

const inventoryRepository = new InventoryRepository(pool);
const inventoryService = new InventoryService(inventoryRepository);
const inventoryController = new InventoryController(inventoryService);

const userRepository = new UserRepository(pool);
const sessionRepository = new SessionRepository(pool);
const authenticate = createAuthenticate(sessionRepository, userRepository);

router.get(
  "/",
  authenticate,
  authorize("admin", "warehouse"),
  validate(getInventoriesQuerySchema, "query"),
  inventoryController.getInventories,
);

router.post(
  "/:productId",
  authenticate,
  authorize("admin"),
  validate(inventoryProductIdParamSchema, "params"),
  validate(createInventorySchema, "body"),
  inventoryController.createInventory,
);

router.get(
  "/:productId",
  authenticate,
  authorize("admin", "warehouse"),
  validate(inventoryProductIdParamSchema, "params"),
  inventoryController.getInventory,
);

router.patch(
  "/:productId",
  authenticate,
  authorize("admin"),
  validate(inventoryProductIdParamSchema, "params"),
  validate(updateInventorySchema, "body"),
  inventoryController.updateStock,
);

export default router;
