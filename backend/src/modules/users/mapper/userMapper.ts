import type { PublicUser, User } from "../types/user.types.js";

export const toPublicUser = (user: User): PublicUser => {
  const { passwordHash: _, ...publicUser } = user;

  return publicUser;
};
