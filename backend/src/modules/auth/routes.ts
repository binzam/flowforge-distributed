import { Router } from "express";
import { pool } from "../../database/index.js";
import { Argon2PasswordHasher } from "../../infrastructure/security/Argon2PasswordHasher.js";
import { GoogleAuthClient } from "../../infrastructure/security/GoogleAuthClient.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { UserRepository } from "../users/repositories/UserRepository.js";
import { AuthController } from "./controllers/AuthController.js";
import { googleAuthSchema, loginSchema } from "./schemas/auth.schemas.js";
import { AuthService } from "./services/AuthService.js";
import { SessionRepository } from "./repositories/SessionRepository.js";
import { config } from "../../config/env.js";

const router = Router();

const userRepository = new UserRepository(pool);
const passwordHasher = new Argon2PasswordHasher();
const sessionRepository = new SessionRepository(pool);
const googleAuthVerifier = new GoogleAuthClient(config.google.clientId);

const authService = new AuthService(
  userRepository,
  passwordHasher,
  sessionRepository,
  googleAuthVerifier,
);

const authController = new AuthController(authService);

router.post("/login", validate(loginSchema), authController.login);
router.post("/google", validate(googleAuthSchema), authController.googleLogin);
router.post("/refresh", authController.refresh);
router.get("/me", authenticate, authController.me);
router.post("/logout", authController.logout);

export default router;
