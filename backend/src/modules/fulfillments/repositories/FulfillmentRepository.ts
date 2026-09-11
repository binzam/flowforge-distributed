import type { Pool } from "pg";
import type {
  FindFulfillmentsResult,
  Fulfillment,
  FulfillmentDetails,
  FulfillmentListItem,
  FulfillmentStatus,
} from "../types/fulfillment.types.js";
import type { GetFulfillmentsQuery } from "../schemas/fulfillment.schemas.js";

export class FulfillmentRepository {
  constructor(private readonly db: Pool) {}

  async findAll(
    options: GetFulfillmentsQuery = {},
  ): Promise<FindFulfillmentsResult> {
    const { status, limit, offset } = options;

    const values: unknown[] = [];
    const conditions: string[] = [];

    if (status !== undefined) {
      values.push(status);
      conditions.push(`f.status = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await this.db.query<{ total: string }>(
      `
    SELECT COUNT(*) AS total
    FROM fulfillments f
    JOIN orders o ON o.id = f.order_id
    JOIN users u ON u.id = o.user_id
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

    const result = await this.db.query<FulfillmentListItem>(
      `
    SELECT
      f.id,
      f.order_id AS "orderId",
      f.status,
      u.name AS "customerName",
      u.email AS "customerEmail",
      o.total_amount AS "totalAmount",
      COUNT(oi.id)::INTEGER AS "itemCount",
      f.created_at AS "createdAt",
      f.updated_at AS "updatedAt"
    FROM fulfillments f
    JOIN orders o ON o.id = f.order_id
    JOIN users u ON u.id = o.user_id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    ${whereClause}
    GROUP BY
      f.id,
      f.order_id,
      f.status,
      u.name,
      u.email,
      o.total_amount,
      f.created_at,
      f.updated_at
    ORDER BY f.created_at DESC
    ${paginationClause};
    `,
      values,
    );

    return {
      fulfillments: result.rows,
      total,
    };
  }
  async create(orderId: string): Promise<Fulfillment> {
    const result = await this.db.query<Fulfillment>(
      `
      INSERT INTO fulfillments (order_id)
      VALUES ($1)
      RETURNING
        id,
        order_id AS "orderId",
        status,
        created_at AS "createdAt",
        updated_at AS "updatedAt";
      `,
      [orderId],
    );

    return result.rows[0]!;
  }

  async findById(id: string): Promise<FulfillmentDetails | null> {
    const result = await this.db.query<FulfillmentDetails>(
      `
    SELECT
      f.id,
      f.order_id AS "orderId",
      f.status,
      u.name AS "customerName",
      u.email AS "customerEmail",
      o.total_amount AS "totalAmount",
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'productId', oi.product_id,
            'productName', p.name,
            'sku', p.sku,
            'quantity', oi.quantity,
            'unitPrice', oi.unit_price
          )
          ORDER BY oi.created_at
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'
      ) AS items,
      f.created_at AS "createdAt",
      f.updated_at AS "updatedAt"
    FROM fulfillments f
    JOIN orders o ON o.id = f.order_id
    JOIN users u ON u.id = o.user_id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN products p ON p.id = oi.product_id
    WHERE f.id = $1
    GROUP BY
      f.id,
      f.order_id,
      f.status,
      u.name,
      u.email,
      o.total_amount,
      f.created_at,
      f.updated_at;
    `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async findByOrderId(orderId: string): Promise<Fulfillment | null> {
    const result = await this.db.query<Fulfillment>(
      `
      SELECT
        id,
        order_id AS "orderId",
        status,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM fulfillments
      WHERE order_id = $1;
      `,
      [orderId],
    );

    return result.rows[0] ?? null;
  }

  async updateStatus(
    id: string,
    status: FulfillmentStatus,
  ): Promise<Fulfillment | null> {
    const result = await this.db.query<Fulfillment>(
      `
      UPDATE fulfillments
      SET
        status = $2,
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        order_id AS "orderId",
        status,
        created_at AS "createdAt",
        updated_at AS "updatedAt";
      `,
      [id, status],
    );

    return result.rows[0] ?? null;
  }
}
