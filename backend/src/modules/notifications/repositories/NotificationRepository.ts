import type { Pool } from "pg";
import type {
  CreateNotificationInput,
  Notification,
} from "../types/notification.types.js";

export class NotificationRepository {
  constructor(private readonly db: Pool) {}
  async create(input: CreateNotificationInput): Promise<Notification> {
    const { userId, data, message, title, type } = input;

    const result = await this.db.query<Notification>(
      `
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      data
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      user_id AS "userId",
      type,
      title,
      message,
      data,
      read_at AS "readAt",
      created_at AS "createdAt";
    `,
      [userId, type, title, message, data],
    );

    return result.rows[0]!;
  }

  async findAllByUserId(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<Notification[]> {
    const result = await this.db.query<Notification>(
      `
    SELECT
      id,
      user_id AS "userId",
      type,
      title,
      message,
      data,
      read_at AS "readAt",
      created_at AS "createdAt"
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2
    OFFSET $3;
    `,
      [userId, limit, offset],
    );

    return result.rows;
  }

  async countByUserId(userId: string): Promise<number> {
    const result = await this.db.query<{ count: string }>(
      `
      SELECT COUNT(*) AS count
      FROM notifications
      WHERE user_id = $1;
      `,
      [userId],
    );

    return Number(result.rows[0]?.count ?? 0);
  }

  async countUnread(userId: string): Promise<number> {
    const result = await this.db.query<{ count: string }>(
      `
      SELECT COUNT(*) AS count
      FROM notifications
      WHERE user_id = $1
        AND read_at IS NULL;
      `,
      [userId],
    );

    return Number(result.rows[0]?.count ?? 0);
  }

  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<Notification | null> {
    const result = await this.db.query<Notification>(
      `
      UPDATE notifications
      SET read_at = NOW()
      WHERE id = $1
        AND user_id = $2
        AND read_at IS NULL
      RETURNING
        id,
        user_id AS "userId",
        type,
        title,
        message,
        data,
        read_at AS "readAt",
        created_at AS "createdAt";
      `,
      [notificationId, userId],
    );

    return result.rows[0] ?? null;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await this.db.query(
      `
      UPDATE notifications
      SET read_at = NOW()
      WHERE user_id = $1
        AND read_at IS NULL;
      `,
      [userId],
    );

    return result.rowCount ?? 0;
  }
}
