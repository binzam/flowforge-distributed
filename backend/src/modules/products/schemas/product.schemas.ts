import { z } from "zod";

export const PRODUCT_CATEGORIES = [
  "electronics",
  "fashion",
  "home_kitchen",
  "beauty_personal_care",
  "sports_outdoors",
  "toys_games",
  "books",
  "automotive",
] as const;

export const productCategorySchema = z.enum(PRODUCT_CATEGORIES);

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

  category: productCategorySchema,
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

export const DEFAULT_PRODUCTS_LIMIT = 20;
export const MAX_PRODUCTS_LIMIT = 100;

export const getProductsQuerySchema = z.object({
  category: productCategorySchema.optional(),
  // An empty `?search=` is treated as "no search" instead of a 400.
  search: z
    .string()
    .trim()
    .max(150)
    .transform((value) => (value.length > 0 ? value : undefined))
    .optional(),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_PRODUCTS_LIMIT)
    .default(DEFAULT_PRODUCTS_LIMIT),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;
