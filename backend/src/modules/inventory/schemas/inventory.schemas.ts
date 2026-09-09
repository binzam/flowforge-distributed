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
