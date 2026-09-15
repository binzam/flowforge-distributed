import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

export const requireIdempotencyKey = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const idempotencyKey = req.header("Idempotency-Key");

  if (!idempotencyKey) {
    throw new AppError("Idempotency-Key header is required", 400);
  }

  req.idempotencyKey = idempotencyKey;

  next();
};
