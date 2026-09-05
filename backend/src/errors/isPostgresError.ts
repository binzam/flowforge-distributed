import type { DatabaseError } from "pg";

export const isPostgresError = (
  error: unknown,
): error is DatabaseError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  );
};