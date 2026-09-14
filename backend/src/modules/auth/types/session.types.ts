import type { UserRole } from "../../users/types/user.types.js";

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}
export interface AccessTokenPayload {
  id: string;
  role: UserRole;
  name: string;
  email: string;
}
