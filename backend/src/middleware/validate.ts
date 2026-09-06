import type { RequestHandler } from "express";
import { z, type ZodType } from "zod";
import { AppError } from "../errors/AppError.js";

export const validate = (
  schema: ZodType,
  source: "body" | "params" | "query" = "body",
): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      throw new AppError(
        "Validation failed",
        400,
        true,
        z.treeifyError(result.error),
      );
    }

    if (source === "query") {
      res.locals.validated = result.data;
    } else {
      req[source] = result.data;
    }

    next();
  };
};
