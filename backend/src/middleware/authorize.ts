import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";
import type { UserRole } from "../modules/users/types/user.types.js";

export const authorize = (...allowedRoles: UserRole[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Forbidden", 403);
    }

    next();
  };
};
