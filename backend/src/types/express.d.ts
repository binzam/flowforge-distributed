import type { AccessTokenPayload } from "../modules/auth/types/session.types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
      idempotencyKey?: string;
    }
  }
}

export {};
