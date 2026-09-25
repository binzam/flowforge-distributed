import type { Pool } from "pg";
import type {
  CreateUserRecord,
  FindUsersResult,
  User,
  UserRole,
} from "../types/user.types.js";
import { AppError } from "../../../errors/AppError.js";
import type { GetUsersQuery } from "../schemas/user.schemas.js";
import { handlePostgresError } from "../../../errors/postgresErrors.js";

const SELECT_FIELDS = `
  id,
  name,
  email,
  password_hash AS "passwordHash",
  google_id AS "googleId",
  role,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

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

  async createFromGoogle(input: {
    name: string;
    email: string;
    googleId: string;
  }): Promise<User> {
    try {
      const result = await this.db.query<User>(
        `
        INSERT INTO users (
          name,
          email,
          google_id
        )
        VALUES ($1, $2, $3)
        RETURNING ${SELECT_FIELDS};
      `,
        [input.name, input.email, input.googleId],
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

  async linkGoogleId(userId: string, googleId: string): Promise<User> {
    try {
      const result = await this.db.query<User>(
        `
        UPDATE users
        SET google_id = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING ${SELECT_FIELDS};
      `,
        [userId, googleId],
      );

      const user = result.rows[0];
      if (!user) {
        throw new AppError("User not found", 404);
      }
      return user;
    } catch (error) {
      return handlePostgresError(error);
    }
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const result = await this.db.query<User>(
      `
      SELECT ${SELECT_FIELDS}
      FROM users
      WHERE google_id = $1;
    `,
      [googleId],
    );

    return result.rows[0] ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query<User>(
      `
      SELECT ${SELECT_FIELDS}
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
      SELECT ${SELECT_FIELDS}
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
  async findByRoles(roles: UserRole[]): Promise<User[]> {
    const result = await this.db.query<User>(
      `
    SELECT ${SELECT_FIELDS}
    FROM users
    WHERE role = ANY($1::user_role[]);
    `,
      [roles],
    );

    return result.rows;
  }
}
