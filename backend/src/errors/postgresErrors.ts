import { AppError } from "./AppError.js";

export const handlePostgresError = (error: unknown): never => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = error.code;

    switch (code) {
      case "23505":
        throw new AppError("A record with this value already exists", 409);

      case "23503":
        throw new AppError("Referenced record does not exist", 400);

      case "23502":
        throw new AppError("Required database field is missing", 400);

      case "22P02":
        throw new AppError("Invalid value provided", 400);
    }
  }

  throw error;
};
