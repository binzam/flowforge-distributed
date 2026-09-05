import type { RequestHandler } from "express";
import { AppError } from "../../../errors/AppError.js";
import type { SessionRepository } from "../repositories/SessionRepository.js";
import type { UserRepository } from "../../users/repositories/UserRepository.js";

export const createAuthenticate = (
  sessionRepository: SessionRepository,
  userRepository: UserRepository,
): RequestHandler => {
  return async (req, _res, next) => {
    const sessionId = req.cookies.session_id;

    if (!sessionId) {
      throw new AppError("Authentication required", 401);
    }

    const session = await sessionRepository.findById(sessionId);

    if (!session) {
      throw new AppError("Invalid or expired session", 401);
    }

    if (session.expiresAt <= new Date()) {
      await sessionRepository.deleteById(session.id);

      throw new AppError("Session has expired", 401);
    }

    const user = await userRepository.findById(session.userId);

    if (!user) {
      throw new AppError("User associated with session not found", 401);
    }

    req.user = user;

    next();
  };
};
