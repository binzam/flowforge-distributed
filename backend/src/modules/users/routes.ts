import { Router } from "express";
import { pool } from "../../database/index.js";
import { UserController } from "./controllers/UserController.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { UserService } from "./services/UserService.js";
import { Argon2PasswordHasher } from "../../infrastructure/security/Argon2PasswordHasher.js";
import {
  createUserSchema,
  getUsersQuerySchema,
  userIdSchema,
} from "./schemas/user.schemas.js";
import { validate } from "../../middleware/validate.js";
import { SessionRepository } from "../auth/repositories/SessionRepository.js";
import { createAuthenticate } from "../auth/middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

const router = Router();

const userRepository = new UserRepository(pool);
const passwordHasher = new Argon2PasswordHasher();
const userService = new UserService(userRepository, passwordHasher);

const userController = new UserController(userService);

const sessionRepository = new SessionRepository(pool);

const authenticate = createAuthenticate(sessionRepository, userRepository);

router.post("/", validate(createUserSchema), userController.create);
router.get("/:id", validate(userIdSchema, "params"), userController.getById);
router.get(
  "/",
  authenticate,
  authorize("admin"),
  validate(getUsersQuerySchema, "query"),
  userController.getAll,
);

export default router;
