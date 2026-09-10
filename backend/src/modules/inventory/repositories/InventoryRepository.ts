import type { Pool } from "pg";
import { AppError } from "../../../errors/AppError.js";
import { handlePostgresError } from "../../../errors/postgresErrors.js";
import type {
  CreateInventoryRecord,
  FindInventoriesResult,
  Inventory,
  InventoryListItem,
  InventoryReservationItem,
  UpdateInventoryRecord,
} from "../types/inventory.types.js";
import type { GetInventoriesQuery } from "../schemas/inventory.schemas.js";

export class InventoryRepository {
  constructor(private readonly db: Pool) {}

  async findAll(
    options: GetInventoriesQuery = {},
  ): Promise<FindInventoriesResult> {
    const { limit, offset } = options;

    const values: unknown[] = [];
    const conditions: string[] = [];

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await this.db.query<{ total: string }>(
      `
      SELECT COUNT(*) AS total
      FROM inventory i
      JOIN products p ON p.id = i.product_id
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

    const result = await this.db.query<InventoryListItem>(
      `
      SELECT
        i.id,
        i.product_id AS "productId",
        p.name AS "productName",
        p.sku,
        i.quantity,
        i.reserved_quantity AS "reservedQuantity",
        i.quantity - i.reserved_quantity AS "availableQuantity",
        i.created_at AS "createdAt",
        i.updated_at AS "updatedAt"
      FROM inventory i
      JOIN products p ON p.id = i.product_id
      ${whereClause}
      ORDER BY p.name ASC
      ${paginationClause};
      `,
      values,
    );

    return {
      inventories: result.rows,
      total,
    };
  }

  async findByProductId(productId: string): Promise<InventoryListItem | null> {
    const result = await this.db.query<InventoryListItem>(
      `
    SELECT
      i.id,
      i.product_id AS "productId",
      p.name AS "productName",
      p.sku,
      i.quantity,
      i.reserved_quantity AS "reservedQuantity",
      i.quantity - i.reserved_quantity AS "availableQuantity",
      i.created_at AS "createdAt",
      i.updated_at AS "updatedAt"
    FROM inventory i
    JOIN products p ON p.id = i.product_id
    WHERE i.product_id = $1;
    `,
      [productId],
    );

    return result.rows[0] ?? null;
  }

  async create(record: CreateInventoryRecord): Promise<Inventory> {
    try {
      const result = await this.db.query<Inventory>(
        `
        INSERT INTO inventory (
          product_id,
          quantity
        )
        VALUES ($1, $2)
        RETURNING
          id,
          product_id AS "productId",
          quantity,
          reserved_quantity AS "reservedQuantity",
          created_at AS "createdAt",
          updated_at AS "updatedAt";
        `,
        [record.productId, record.quantity],
      );

      const inventory = result.rows[0];

      if (!inventory) {
        throw new AppError("Failed to create inventory", 500);
      }

      return inventory;
    } catch (error) {
      return handlePostgresError(error);
    }
  }

  async update(
    productId: string,
    record: UpdateInventoryRecord,
  ): Promise<Inventory | null> {
    try {
      const result = await this.db.query<Inventory>(
        `
        UPDATE inventory
        SET
          quantity = $2,
          updated_at = NOW()
        WHERE product_id = $1
        RETURNING
          id,
          product_id AS "productId",
          quantity,
          reserved_quantity AS "reservedQuantity",
          created_at AS "createdAt",
          updated_at AS "updatedAt";
        `,
        [productId, record.quantity],
      );

      return result.rows[0] ?? null;
    } catch (error) {
      return handlePostgresError(error);
    }
  }
  async reserveStock(items: InventoryReservationItem[]): Promise<Inventory[]> {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      const inventories: Inventory[] = [];
      const sortedItems = [...items].sort((a, b) =>
        a.productId.localeCompare(b.productId),
      );

      for (const item of sortedItems) {
        const inventoryResult = await client.query<Inventory>(
          `
        SELECT
          id,
          product_id AS "productId",
          quantity,
          reserved_quantity AS "reservedQuantity",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM inventory
        WHERE product_id = $1
        FOR UPDATE;
        `,
          [item.productId],
        );

        const inventory = inventoryResult.rows[0];

        if (!inventory) {
          throw new AppError(
            `Inventory not found for product ${item.productId}`,
            404,
          );
        }

        const availableQuantity =
          inventory.quantity - inventory.reservedQuantity;

        if (availableQuantity < item.quantity) {
          throw new AppError(
            `Insufficient stock for product ${item.productId}. Available quantity: ${availableQuantity}`,
            409,
          );
        }

        const updateResult = await client.query<Inventory>(
          `
        UPDATE inventory
        SET
          reserved_quantity = reserved_quantity + $2,
          updated_at = NOW()
        WHERE product_id = $1
        RETURNING
          id,
          product_id AS "productId",
          quantity,
          reserved_quantity AS "reservedQuantity",
          created_at AS "createdAt",
          updated_at AS "updatedAt";
        `,
          [item.productId, item.quantity],
        );

        const updated = updateResult.rows[0];

        if (!updated) {
          throw new AppError(
            `Failed to reserve stock for product ${item.productId}`,
            500,
          );
        }

        inventories.push(updated);
      }

      await client.query("COMMIT");
      console.log("inventory service:reserve stock: inventories", inventories);
      return inventories;
    } catch (error) {
      await client.query("ROLLBACK");

      if (error instanceof AppError) {
        throw error;
      }

      return handlePostgresError(error);
    } finally {
      client.release();
    }
  }

  async releaseStock(items: InventoryReservationItem[]): Promise<Inventory[]> {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      const inventories: Inventory[] = [];

      const sortedItems = [...items].sort((a, b) =>
        a.productId.localeCompare(b.productId),
      );

      for (const item of sortedItems) {
        const inventoryResult = await client.query<Inventory>(
          `
        SELECT
          id,
          product_id AS "productId",
          quantity,
          reserved_quantity AS "reservedQuantity",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM inventory
        WHERE product_id = $1
        FOR UPDATE;
        `,
          [item.productId],
        );

        const inventory = inventoryResult.rows[0];

        if (!inventory) {
          throw new AppError(
            `Inventory not found for product ${item.productId}`,
            404,
          );
        }

        if (inventory.reservedQuantity < item.quantity) {
          throw new AppError(
            `Cannot release ${item.quantity} units for product ${item.productId}. Only ${inventory.reservedQuantity} units are reserved.`,
            409,
          );
        }

        const updateResult = await client.query<Inventory>(
          `
        UPDATE inventory
        SET
          reserved_quantity = reserved_quantity - $2,
          updated_at = NOW()
        WHERE product_id = $1
        RETURNING
          id,
          product_id AS "productId",
          quantity,
          reserved_quantity AS "reservedQuantity",
          created_at AS "createdAt",
          updated_at AS "updatedAt";
        `,
          [item.productId, item.quantity],
        );

        const updated = updateResult.rows[0];

        if (!updated) {
          throw new AppError(
            `Failed to release stock for product ${item.productId}`,
            500,
          );
        }

        inventories.push(updated);
      }

      await client.query("COMMIT");

      return inventories;
    } catch (error) {
      await client.query("ROLLBACK");

      if (error instanceof AppError) {
        throw error;
      }

      return handlePostgresError(error);
    } finally {
      client.release();
    }
  }
}
