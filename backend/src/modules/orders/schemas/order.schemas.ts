import z from "zod";

export const ORDER_STATUSES = [
  "pending",
  "payment_pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "failed",
] as const;

export const orderStatusSchema = z.enum(ORDER_STATUSES);

export const createOrderItemSchema = z.object({
  productId: z.uuid(),
  quantity: z.coerce.number().int().positive(),
});

export const createOrderSchema = z.object({
  items: z
    .array(createOrderItemSchema)
    .min(1)
    .refine(
      (items) => {
        const productIds = items.map((item) => item.productId);

        return new Set(productIds).size === productIds.length;
      },
      {
        message: "Each product can only appear once in an order",
      },
    ),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const orderIdSchema = z.object({
  id: z.uuid(),
});

export const getOrdersQuerySchema = z.object({
  status: orderStatusSchema.optional(),
  userId: z.uuid().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});
export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>;
export const getMyOrdersQuerySchema = getOrdersQuerySchema.omit({
  userId: true,
});
export type GetMyOrdersQuery = z.infer<typeof getMyOrdersQuerySchema>;

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
