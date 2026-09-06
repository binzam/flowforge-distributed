import { Router } from "express";
import { pool } from "../../database/index.js";
import { validate } from "../../middleware/validate.js";
import { authorize } from "../../middleware/authorize.js";
import { createAuthenticate } from "../auth/middleware/authenticate.js";
import { UserRepository } from "../users/repositories/UserRepository.js";
import { SessionRepository } from "../auth/repositories/SessionRepository.js";
import { ProductController } from "./controllers/ProductController.js";
import { ProductRepository } from "./repositories/ProductRepository.js";
import { ProductService } from "./services/ProductService.js";
import {
  createProductSchema,
  productIdSchema,
  updateProductSchema,
} from "./schemas/product.schemas.js";

const router = Router();

const productRepository = new ProductRepository(pool);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const userRepository = new UserRepository(pool);
const sessionRepository = new SessionRepository(pool);

const authenticate = createAuthenticate(sessionRepository, userRepository);



// Public
router.get("/", productController.getAll);

router.get(
  "/:id",
  validate(productIdSchema, "params"),
  productController.getById,
);

// Admin
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createProductSchema),
  productController.create,
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(productIdSchema, "params"),
  validate(updateProductSchema),
  productController.update,
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(productIdSchema, "params"),
  productController.deactivate,
);

export default router;
