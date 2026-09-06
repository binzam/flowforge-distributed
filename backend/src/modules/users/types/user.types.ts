import type { Request } from "express";
import type { GetUsersQuery } from "../schemas/user.schemas.js";

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

// Get all users query
export interface FindUsersResult {
  users: User[];
  total: number;
}