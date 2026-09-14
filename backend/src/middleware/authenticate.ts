import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import type { AccessTokenPayload } from "../modules/auth/types/session.types.js";
import { AppError } from "../errors/AppError.js";
import { config } from "../config/env.js";

const isAccessTokenPayload = (
  payload: unknown,
): payload is AccessTokenPayload => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as Record<string, unknown>).id === "string" &&
    typeof (payload as Record<string, unknown>).name === "string" &&
    typeof (payload as Record<string, unknown>).email === "string" &&
    typeof (payload as Record<string, unknown>).role === "string"
  );
};

export const authenticate: RequestHandler = (req, _res, next) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    throw new AppError("Authentication required", 401);
  }

  let payload: string | jwt.JwtPayload;

  try {
    payload = jwt.verify(accessToken, config.JWT_ACCESS_SECRET);
  } catch {
    throw new AppError("Invalid or expired access token", 401);
  }

  if (!isAccessTokenPayload(payload)) {
    throw new AppError("Invalid access token payload", 401);
  }

  req.user = {
    id: payload.id,
    role: payload.role,
    email: payload.email,
    name: payload.name,
  };

  next();
};
