import z from "zod";

export const FULFILLMENT_STATUSES = [
  "pending",
  "processing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const fulfillmentStatusSchema = z.enum(FULFILLMENT_STATUSES);

export const fulfillmentIdSchema = z.object({
  id: z.uuid(),
});
export type FulfillmentIdParam = z.infer<
  typeof fulfillmentIdSchema
>;
export const orderIdSchema = z.object({
  orderId: z.uuid(),
});

export const updateFulfillmentStatusSchema = z.object({
  status: fulfillmentStatusSchema,
});

export type UpdateFulfillmentStatusInput = z.infer<
  typeof updateFulfillmentStatusSchema
>;

export const getFulfillmentsQuerySchema = z.object({
  status: fulfillmentStatusSchema.optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});

export type GetFulfillmentsQuery = z.infer<
  typeof getFulfillmentsQuerySchema
>;
