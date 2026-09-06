import type { Pool } from "pg";
import { AppError } from "../../../errors/AppError.js";
import { handlePostgresError } from "../../../errors/postgresErrors.js";
import type {
  CreateOrderItemRecord,
  FindOrdersResult,
  Order,
  OrderItem,
  OrderStatus,
  OrderWithItems,
} from "../types/order.types.js";
import type { GetOrdersQuery } from "../schemas/order.schemas.js";

interface ProductPrice {
  id: string;
  price: string;
}

export class OrderRepository {
  constructor(private readonly db: Pool) {}

  async findProductPrices(productIds: string[]): Promise<ProductPrice[]> {
    const result = await this.db.query<ProductPrice>(
      `SELECT id, price FROM products WHERE id = ANY($1::uuid[]);`,
      [productIds],
    );

    return result.rows;
  }

  async createWithItems(
    userId: string,
    items: CreateOrderItemRecord[],
  ): Promise<OrderWithItems> {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      const totalAmount = items
        .reduce((sum, item) => sum + item.quantity * Number(item.unitPrice), 0)
        .toFixed(2);

      const orderResult = await client.query<Order>(
        `
        INSERT INTO orders (user_id, total_amount)
        VALUES ($1, $2)
        RETURNING
          id,
          user_id AS "userId",
          status,
          total_amount AS "totalAmount",
          created_at AS "createdAt",
          updated_at AS "updatedAt";
        `,
        [userId, totalAmount],
      );

      const order = orderResult.rows[0];
      if (!order) {
        throw new AppError("Failed to create order", 500);
      }

      const values: unknown[] = [];
      const rowPlaceholders: string[] = [];

      items.forEach((item, index) => {
        const base = index * 4;
        rowPlaceholders.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`,
        );
        values.push(order.id, item.productId, item.quantity, item.unitPrice);
      });

      const itemsResult = await client.query<OrderItem>(
        `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES ${rowPlaceholders.join(", ")}
        RETURNING
          id,
          order_id AS "orderId",
          product_id AS "productId",
          quantity,
          unit_price AS "unitPrice",
          created_at AS "createdAt";
        `,
        values,
      );

      await client.query("COMMIT");

      return { ...order, items: itemsResult.rows };
    } catch (error) {
      await client.query("ROLLBACK");
      return handlePostgresError(error);
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<OrderWithItems | null> {
    const orderResult = await this.db.query<Order>(
      `
      SELECT
        id,
        user_id AS "userId",
        status,
        total_amount AS "totalAmount",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM orders
      WHERE id = $1;
      `,
      [id],
    );

    const order = orderResult.rows[0];
    if (!order) {
      return null;
    }

    const itemsResult = await this.db.query<OrderItem>(
      `
      SELECT
        id,
        order_id AS "orderId",
        product_id AS "productId",
        quantity,
        unit_price AS "unitPrice",
        created_at AS "createdAt"
      FROM order_items
      WHERE order_id = $1
      ORDER BY created_at ASC;
      `,
      [id],
    );

    return { ...order, items: itemsResult.rows };
  }

  async findAll(options: GetOrdersQuery = {}): Promise<FindOrdersResult> {
    const { status, userId, limit, offset } = options;

    const values: unknown[] = [];
    const conditions: string[] = [];

    if (status !== undefined) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (userId !== undefined) {
      values.push(userId);
      conditions.push(`user_id = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await this.db.query<{ total: string }>(
      `
      SELECT COUNT(*) AS total
      FROM orders
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

    const result = await this.db.query<Order>(
      `
      SELECT
        id,
        user_id AS "userId",
        status,
        total_amount AS "totalAmount",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM orders
      ${whereClause}
      ORDER BY created_at DESC
      ${paginationClause};
      `,
      values,
    );

    return {
      orders: result.rows,
      total,
    };
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const result = await this.db.query<Order>(
      `
      UPDATE orders
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        user_id AS "userId",
        status,
        total_amount AS "totalAmount",
        created_at AS "createdAt",
        updated_at AS "updatedAt";
      `,
      [id, status],
    );

    return result.rows[0] ?? null;
  }
}
