import type { Pool } from "pg";
import type { OrderEvent } from "./orderEvent.types.js";

export class OrderEventRepository {
  constructor(private readonly pool: Pool) {}

  async create(
    orderId: string,
    eventType: string,
    payload: Record<string, unknown>,
    occurredAt: Date,
  ): Promise<OrderEvent> {
    const result = await this.pool.query<OrderEvent>(
      `
        INSERT INTO order_events (
          order_id,
          event_type,
          payload,
          occurred_at
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          order_id AS "orderId",
          event_type AS "eventType",
          payload,
          occurred_at AS "occurredAt"
      `,
      [orderId, eventType, JSON.stringify(payload), occurredAt],
    );

    return result.rows[0]!;
  }

  async findByOrderId(orderId: string): Promise<OrderEvent[]> {
    const result = await this.pool.query<OrderEvent>(
      `
        SELECT
          id,
          order_id AS "orderId",
          event_type AS "eventType",
          payload,
          occurred_at AS "occurredAt"
        FROM order_events
        WHERE order_id = $1
        ORDER BY occurred_at ASC, id ASC
      `,
      [orderId],
    );

    return result.rows;
  }
}
