import { z } from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(150, "Product name must be 150 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(5000, "Description must be 5000 characters or fewer")
    .optional()
    .or(z.literal("")),
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(50, "SKU must be 50 characters or fewer"),
  price: z
    .string()
    .trim()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid amount")
    .refine((value) => Number(value) >= 0, {
      message: "Price cannot be negative",
    }),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
