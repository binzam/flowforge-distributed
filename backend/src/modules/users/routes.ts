import { Router } from "express";
import { pool } from "../../database/index.js";
import { UserController } from "./controllers/UserController.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { UserService } from "./services/UserService.js";
import { Argon2PasswordHasher } from "../../infrastructure/security/Argon2PasswordHasher.js";
import { createUserSchema } from "./schemas/user.schemas.js";
import { validate } from "../../middleware/validate.js";

const router = Router();

const userRepository = new UserRepository(pool);
const passwordHasher = new Argon2PasswordHasher();
const userService = new UserService(userRepository, passwordHasher);

const userController = new UserController(userService);

router.post("/", validate(createUserSchema), userController.create);

export default router;
