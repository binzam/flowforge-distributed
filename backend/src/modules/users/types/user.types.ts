export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
}

export interface CreateUserRecord {
  name: string;
  email: string;
  passwordHash: string;
}
export type UserRole = "customer" | "admin" | "warehouse";
