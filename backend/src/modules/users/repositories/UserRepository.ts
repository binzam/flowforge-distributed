import type { Pool } from "pg";
import type {
  CreateUserRecord,
  FindUsersResult,
  User,
} from "../types/user.types.js";
import { AppError } from "../../../errors/AppError.js";
import type { GetUsersQuery } from "../schemas/user.schemas.js";
import { handlePostgresError } from "../../../errors/postgresErrors.js";

export class UserRepository {
  constructor(private readonly db: Pool) {}

  async create(input: CreateUserRecord): Promise<User> {
    try {
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
        [input.name, input.email, input.passwordHash],
      );

      const user = result.rows[0];
      if (!user) {
        throw new AppError("Failed to create user", 500);
      }
      return user;
    } catch (error) {
      return handlePostgresError(error);
    }
  }
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query<User>(
      `
      SELECT
        id,
        name,
        email,
        password_hash AS "passwordHash",
        role,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE email = $1;
    `,
      [email],
    );

    return result.rows[0] ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.query<User>(
      `
      SELECT
        id,
        name,
        email,
        password_hash AS "passwordHash",
        role,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE id = $1;
    `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async findAll(options: GetUsersQuery = {}): Promise<FindUsersResult> {
    const { role, limit, offset } = options;

    const values: unknown[] = [];
    const conditions: string[] = [];

    if (role !== undefined) {
      values.push(role);
      conditions.push(`role = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await this.db.query<{ total: string }>(
      `
      SELECT COUNT(*) AS total
      FROM users
      ${whereClause};
      `,
      values,
    );

    const total = Number(countResult.rows[0]?.total ?? 0);

    let paginationClause = "";

    if (limit !== undefined) {
      values.push(limit);
      paginationClause += ` LIMIT $${values.length}`;
    }

    if (offset !== undefined) {
      values.push(offset);
      paginationClause += ` OFFSET $${values.length}`;
    }

    const result = await this.db.query<User>(
      `
      SELECT
        id,
        name,
        email,
        role,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      ${paginationClause};
      `,
      values,
    );

    return {
      users: result.rows,
      total,
    };
  }
}
