import type { Pool } from "pg";
import { AppError } from "../../../errors/AppError.js";
import { handlePostgresError } from "../../../errors/postgresErrors.js";
import type {
  CreateOrderItemRecord,
  FindOrdersResult,
  Order,
  OrderItem,
  OrderItemWithProductRow,
  OrderStatus,
  OrderSummary,
  OrderSummaryItem,
  OrderWithCustomerRow,
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
  async findByIdWithDetails(id: string): Promise<OrderSummary | null> {
    const orderResult = await this.db.query<OrderWithCustomerRow>(
      `
      SELECT
        o.id,
        o.status,
        o.total_amount AS "totalAmount",
        o.created_at AS "createdAt",
        o.updated_at AS "updatedAt",
        u.id AS "customerId",
        u.name AS "customerName"
      FROM orders o
      JOIN users u ON u.id = o.user_id
      WHERE o.id = $1;
      `,
      [id],
    );

    const row = orderResult.rows[0];
    if (!row) {
      return null;
    }

    const itemsResult = await this.db.query<OrderItemWithProductRow>(
      `
      SELECT
        oi.order_id AS "orderId",
        oi.quantity,
        oi.unit_price AS "unitPrice",
        p.id AS "productId",
        p.name AS "productName",
        p.sku AS "productSku"
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = $1
      ORDER BY oi.created_at ASC;
      `,
      [id],
    );

    const items: OrderSummaryItem[] = itemsResult.rows.map((item) => ({
      product: {
        id: item.productId,
        name: item.productName,
        sku: item.productSku,
      },
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    return {
      id: row.id,
      customer: { id: row.customerId, name: row.customerName },
      status: row.status,
      totalAmount: row.totalAmount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      items,
    };
  }
  async findAll(options: GetOrdersQuery = {}): Promise<FindOrdersResult> {
    const { status, userId, limit, offset } = options;

    const values: unknown[] = [];
    const conditions: string[] = [];

    if (status !== undefined) {
      values.push(status);
      conditions.push(`o.status = $${values.length}`);
    }

    if (userId !== undefined) {
      values.push(userId);
      conditions.push(`o.user_id = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await this.db.query<{ total: string }>(
      `
      SELECT COUNT(*) AS total
      FROM orders o
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

    const orderRowsResult = await this.db.query<OrderWithCustomerRow>(
      `
      SELECT
        o.id,
        o.status,
        o.total_amount AS "totalAmount",
        o.created_at AS "createdAt",
        o.updated_at AS "updatedAt",
        u.id AS "customerId",
        u.name AS "customerName"
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ${whereClause}
      ORDER BY o.created_at DESC
      ${paginationClause};
      `,
      values,
    );

    const orderRows = orderRowsResult.rows;

    if (orderRows.length === 0) {
      return { orders: [], total };
    }

    const orderIds = orderRows.map((row) => row.id);

    const itemRowsResult = await this.db.query<OrderItemWithProductRow>(
      `
      SELECT
        oi.order_id AS "orderId",
        oi.quantity,
        oi.unit_price AS "unitPrice",
        p.id AS "productId",
        p.name AS "productName",
        p.sku AS "productSku"
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ANY($1::uuid[])
      ORDER BY oi.created_at ASC;
      `,
      [orderIds],
    );

    const itemsByOrderId = new Map<string, OrderSummaryItem[]>();

    for (const row of itemRowsResult.rows) {
      const item: OrderSummaryItem = {
        product: {
          id: row.productId,
          name: row.productName,
          sku: row.productSku,
        },
        quantity: row.quantity,
        unitPrice: row.unitPrice,
      };

      const existing = itemsByOrderId.get(row.orderId);
      if (existing) {
        existing.push(item);
      } else {
        itemsByOrderId.set(row.orderId, [item]);
      }
    }

    const orders: OrderSummary[] = orderRows.map((row) => ({
      id: row.id,
      customer: { id: row.customerId, name: row.customerName },
      status: row.status,
      totalAmount: row.totalAmount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      items: itemsByOrderId.get(row.id) ?? [],
    }));

    return { orders, total };
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
    console.log("order repository: updatestatus: result", result.rows[0]);

    return result.rows[0] ?? null;
  }
}
