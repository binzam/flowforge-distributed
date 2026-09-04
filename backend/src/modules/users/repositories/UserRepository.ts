import type { Pool } from "pg";
import type {  User } from "../types/user.types.js";
import { AppError } from "../../../errors/AppError.js";
import type { CreateUserInput } from "../schemas/user.schemas.js";

export class UserRepository {
  constructor(private readonly db: Pool) {}

  async create(input: CreateUserInput): Promise<User> {
    const result = await this.db.query<User>(
      `
        INSERT INTO users (
          name,
          email,
          password_hash
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          name,
          email,
          password_hash AS "passwordHash",
          created_at AS "createdAt",
          updated_at AS "updatedAt";
      `,
      [input.name, input.email, input.password],
    );

    const user = result.rows[0];
    if (!user) {
      throw new AppError("Failed to create user: No row returned", 404);
    }
    return user;
  }
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query<User>(
      `
      SELECT
        id,
        name,
        email,
        password_hash AS "passwordHash",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE email = $1;
    `,
      [email],
    );

    return result.rows[0] ?? null;
  }
}
