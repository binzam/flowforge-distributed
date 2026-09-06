import type { Pool } from "pg";
import { AppError } from "../../../errors/AppError.js";
import { handlePostgresError } from "../../../errors/postgresErrors.js";
import type { Product } from "../types/product.types.js";
import type {
  UpdateProductInput,
  CreateProductInput,
} from "../schemas/product.schemas.js";

export class ProductRepository {
  constructor(private readonly db: Pool) {}

  async create(input: CreateProductInput): Promise<Product> {
    try {
      const result = await this.db.query<Product>(
        `
        INSERT INTO products (
          name,
          description,
          sku,
          price
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          name,
          description,
          sku,
          price,
          is_active AS "isActive",
          created_at AS "createdAt",
          updated_at AS "updatedAt";
        `,
        [input.name, input.description, input.sku, input.price],
      );

      const product = result.rows[0];

      if (!product) {
        throw new AppError("Failed to create product", 500);
      }

      return product;
    } catch (error) {
      return handlePostgresError(error);
    }
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.db.query<Product>(
      `
      SELECT
        id,
        name,
        description,
        sku,
        price,
        is_active AS "isActive",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM products
      WHERE id = $1;
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async findAll(): Promise<Product[]> {
    const result = await this.db.query<Product>(
      `
      SELECT
        id,
        name,
        description,
        sku,
        price,
        is_active AS "isActive",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM products
      WHERE is_active = TRUE
      ORDER BY created_at DESC;
      `,
    );

    return result.rows;
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    try {
      const fields: string[] = [];
      const values: unknown[] = [];

      if (input.name !== undefined) {
        fields.push(`name = $${values.length + 1}`);
        values.push(input.name);
      }

      if (input.description !== undefined) {
        fields.push(`description = $${values.length + 1}`);
        values.push(input.description);
      }

      if (input.sku !== undefined) {
        fields.push(`sku = $${values.length + 1}`);
        values.push(input.sku);
      }

      if (input.price !== undefined) {
        fields.push(`price = $${values.length + 1}`);
        values.push(input.price);
      }

      fields.push(`updated_at = NOW()`);

      values.push(id);

      const result = await this.db.query<Product>(
        `
        UPDATE products
        SET ${fields.join(", ")}
        WHERE id = $${values.length}
        RETURNING
          id,
          name,
          description,
          sku,
          price,
          is_active AS "isActive",
          created_at AS "createdAt",
          updated_at AS "updatedAt";
        `,
        values,
      );

      const product = result.rows[0];

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      return product;
    } catch (error) {
      return handlePostgresError(error);
    }
  }

  async deactivate(id: string): Promise<void> {
    const result = await this.db.query(
      `
      UPDATE products
      SET
        is_active = FALSE,
        updated_at = NOW()
      WHERE id = $1
        AND is_active = TRUE;
      `,
      [id],
    );

    if (result.rowCount === 0) {
      throw new AppError("Product not found", 404);
    }
  }
  async findBySku(sku: string): Promise<Product | null> {
    const result = await this.db.query<Product>(
      `
    SELECT
      id,
      name,
      description,
      sku,
      price,
      is_active AS "isActive",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM products
    WHERE sku = $1;
    `,
      [sku],
    );

    return result.rows[0] ?? null;
  }
}
