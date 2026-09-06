import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(150),

  description: z.string().trim().max(5000).nullable().optional(),

  sku: z.string().trim().min(1).max(50),

  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid amount")
    .refine((value) => Number(value) >= 0, {
      message: "Price cannot be negative",
    }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const productIdSchema = z.object({
  id: z.uuid(),
});
