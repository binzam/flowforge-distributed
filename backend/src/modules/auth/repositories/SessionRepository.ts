import type { Pool } from "pg";
import type { Session } from "../types/session.types.js";

export class SessionRepository {
  constructor(private readonly db: Pool) {}

  async create(userId: string, expiresAt: Date): Promise<Session> {
    const result = await this.db.query<Session>(
      `
      INSERT INTO sessions (
        user_id,
        expires_at
      )
      VALUES ($1, $2)
      RETURNING
        id,
        user_id AS "userId",
        expires_at AS "expiresAt",
        created_at AS "createdAt";
      `,
      [userId, expiresAt],
    );

    const session = result.rows[0];

    if (!session) {
      throw new Error("Failed to create session");
    }

    return session;
  }

  async findById(id: string): Promise<Session | null> {
    const result = await this.db.query<Session>(
      `
      SELECT
        id,
        user_id AS "userId",
        expires_at AS "expiresAt",
        created_at AS "createdAt"
      FROM sessions
      WHERE id = $1;
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async deleteById(id: string): Promise<void> {
    await this.db.query(
      `
      DELETE FROM sessions
      WHERE id = $1;
      `,
      [id],
    );
  }
}
