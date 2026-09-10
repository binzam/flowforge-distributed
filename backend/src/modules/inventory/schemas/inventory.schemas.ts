import z from "zod";

export const inventoryProductIdParamSchema = z.object({
  productId: z.uuid(),
});
export type InventoryProductIdParam = z.infer<
  typeof inventoryProductIdParamSchema
>;

export const createInventorySchema = z.object({
  quantity: z.number().int().nonnegative(),
});
export type CreateInventoryInput = z.infer<typeof createInventorySchema>;

export const updateInventorySchema = z.object({
  quantity: z.number().int().nonnegative(),
});
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;

export const getInventoriesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});
export type GetInventoriesQuery = z.infer<typeof getInventoriesQuerySchema>;
