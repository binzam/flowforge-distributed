import type { Pool } from "pg";
import type {
  FindAllPaymentsResult,
  Payment,
  PaymentStatus,
} from "../types/payment.types.js";
import type { GetPaymentsQuery } from "../schemas/payment.schemas.js";

export class PaymentRepository {
  constructor(private readonly db: Pool) {}

  /**
   * Creates the (single) payment row for an order, or resets it for a
   * retry. payments.order_id is UNIQUE, so there is at most one payment
   * record per order — this upserts instead of inserting. The WHERE
   * clause on the conflict update refuses to touch a payment that's
   * already "successful", so a retried checkout can never clobber a
   * completed payment; in that case no row is returned.
   */
  async upsertForOrder(
    orderId: string,
    amount: string,
    provider: string,
    providerPaymentId: string,
  ): Promise<Payment | null> {
    const result = await this.db.query<Payment>(
      `
      INSERT INTO payments (order_id, amount, status, provider, provider_payment_id)
      VALUES ($1, $2, 'pending', $3, $4)
      ON CONFLICT (order_id) DO UPDATE
      SET
        amount = EXCLUDED.amount,
        status = 'pending',
        provider = EXCLUDED.provider,
        provider_payment_id = EXCLUDED.provider_payment_id,
        updated_at = NOW()
      WHERE payments.status <> 'successful'
      RETURNING
        id,
        order_id AS "orderId",
        amount,
        status,
        provider,
        provider_payment_id AS "providerPaymentId",
        created_at AS "createdAt",
        updated_at AS "updatedAt";
      `,
      [orderId, amount, provider, providerPaymentId],
    );

    return result.rows[0] ?? null;
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const result = await this.db.query<Payment>(
      `
      SELECT
        id,
        order_id AS "orderId",
        amount,
        status,
        provider,
        provider_payment_id AS "providerPaymentId",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM payments
      WHERE order_id = $1;
      `,
      [orderId],
    );

    return result.rows[0] ?? null;
  }

  async findByProviderPaymentId(
    providerPaymentId: string,
  ): Promise<Payment | null> {
    const result = await this.db.query<Payment>(
      `
      SELECT
        id,
        order_id AS "orderId",
        amount,
        status,
        provider,
        provider_payment_id AS "providerPaymentId",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM payments
      WHERE provider_payment_id = $1;
      `,
      [providerPaymentId],
    );

    return result.rows[0] ?? null;
  }

  async updateStatus(
    id: string,
    status: PaymentStatus,
  ): Promise<Payment | null> {
    const result = await this.db.query<Payment>(
      `
      UPDATE payments
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        order_id AS "orderId",
        amount,
        status,
        provider,
        provider_payment_id AS "providerPaymentId",
        created_at AS "createdAt",
        updated_at AS "updatedAt";
      `,
      [id, status],
    );
    console.log("payment repository: updatestatus: result", result.rows[0]);

    return result.rows[0] ?? null;
  }
  async findAll(options: GetPaymentsQuery): Promise<FindAllPaymentsResult> {
    const { status, limit, offset } = options;

    const conditions: string[] = [];
    const values: unknown[] = [];

    if (status) {
      values.push(status);
      conditions.push(`p.status = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await this.db.query<{ count: string }>(
      `
    SELECT COUNT(*) AS count
    FROM payments p
    ${whereClause};
    `,
      values,
    );

    const total = Number(countResult.rows[0]?.count ?? 0);

    const dataValues = [...values];

    const pagination: string[] = [];

    if (limit !== undefined) {
      dataValues.push(limit);
      pagination.push(`LIMIT $${dataValues.length}`);
    }

    if (offset !== undefined) {
      dataValues.push(offset);
      pagination.push(`OFFSET $${dataValues.length}`);
    }

    const result = await this.db.query<Payment>(
      `
    SELECT
      p.id,
      p.order_id AS "orderId",
      p.amount,
      p.status,
      p.provider,
      p.provider_payment_id AS "providerPaymentId",
      p.created_at AS "createdAt",
      p.updated_at AS "updatedAt"
    FROM payments p
    ${whereClause}
    ORDER BY p.created_at DESC
    ${pagination.join("\n")};
    `,
      dataValues,
    );

    return {
      payments: result.rows,
      total,
    };
  }
}
