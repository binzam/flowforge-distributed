import { Router } from "express";
import { pool } from "../../database/index.js";
import { validate } from "../../middleware/validate.js";
import { authorize } from "../../middleware/authorize.js";
import { ProductController } from "./controllers/ProductController.js";
import { ProductRepository } from "./repositories/ProductRepository.js";
import { ProductService } from "./services/ProductService.js";
import {
  createProductSchema,
  productIdSchema,
  updateProductSchema,
} from "./schemas/product.schemas.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

const productRepository = new ProductRepository(pool);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

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
