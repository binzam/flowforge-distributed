import { Router } from "express";
import { pool } from "../../database/index.js";
import { Argon2PasswordHasher } from "../../infrastructure/security/Argon2PasswordHasher.js";
import { validate } from "../../middleware/validate.js";
import { UserRepository } from "../users/repositories/UserRepository.js";
import { AuthController } from "./controllers/AuthController.js";
import { loginSchema } from "./schemas/auth.schemas.js";
import { AuthService } from "./services/AuthService.js";
import { SessionRepository } from "./repositories/SessionRepository.js";

const router = Router();

const userRepository = new UserRepository(pool);
const passwordHasher = new Argon2PasswordHasher();
const sessionRepository = new SessionRepository(pool);

const authService = new AuthService(
  userRepository,
  passwordHasher,
  sessionRepository,
);

const authController = new AuthController(authService);

router.post("/login", validate(loginSchema), authController.login);

export default router;
