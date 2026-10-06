import type { Pool } from "pg";
import { AppError } from "../../../errors/AppError.js";
import { handlePostgresError } from "../../../errors/postgresErrors.js";
import type { FindProductsResult, Product } from "../types/product.types.js";
import type {
  CreateProductInput,
  GetProductsQuery,
  UpdateProductInput,
} from "../schemas/product.schemas.js";

const PRODUCT_COLUMNS = `
  id,
  name,
  description,
  sku,
  price,
  category,
  is_active AS "isActive",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

// Escapes LIKE/ILIKE wildcards so user input like "50%" or "a_b" is matched literally.
function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

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
          price,
          category
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING ${PRODUCT_COLUMNS};
        `,
        [
          input.name,
          input.description ?? null,
          input.sku,
          input.price,
          input.category,
        ],
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
      SELECT ${PRODUCT_COLUMNS}
      FROM products
      WHERE id = $1;
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async findAll(options: GetProductsQuery): Promise<FindProductsResult> {
    const { category, search, limit, offset } = options;

    const values: unknown[] = [];
    const conditions: string[] = ["is_active = TRUE"];

    if (category !== undefined) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    if (search !== undefined) {
      values.push(`%${escapeLikePattern(search)}%`);
      conditions.push(`name ILIKE $${values.length}`);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const limitPlaceholder = `$${values.length + 1}`;
    const offsetPlaceholder = `$${values.length + 2}`;

    const [countResult, productsResult] = await Promise.all([
      this.db.query<{ total: string }>(
        `
        SELECT COUNT(*) AS total
        FROM products
        ${whereClause};
        `,
        values,
      ),
      this.db.query<Product>(
        `
        SELECT ${PRODUCT_COLUMNS}
        FROM products
        ${whereClause}
        ORDER BY created_at DESC, id DESC
        LIMIT ${limitPlaceholder}
        OFFSET ${offsetPlaceholder};
        `,
        [...values, limit, offset],
      ),
    ]);

    return {
      products: productsResult.rows,
      total: Number(countResult.rows[0]?.total ?? 0),
    };
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

      if (input.category !== undefined) {
        fields.push(`category = $${values.length + 1}`);
        values.push(input.category);
      }

      fields.push(`updated_at = NOW()`);

      values.push(id);

      const result = await this.db.query<Product>(
        `
        UPDATE products
        SET ${fields.join(", ")}
        WHERE id = $${values.length}
        RETURNING ${PRODUCT_COLUMNS};
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
      SELECT ${PRODUCT_COLUMNS}
      FROM products
      WHERE sku = $1;
      `,
      [sku],
    );

    return result.rows[0] ?? null;
  }
}
