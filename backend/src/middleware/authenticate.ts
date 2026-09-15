import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";
import { verifyAccessToken } from "./accessToken.js";

export const authenticate: RequestHandler = async (req, _res, next) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    throw new AppError("Authentication required", 401);
  }

  try {
    req.user = await verifyAccessToken(accessToken);
  } catch {
    throw new AppError("Invalid or expired access token", 401);
  }

  next();
};
