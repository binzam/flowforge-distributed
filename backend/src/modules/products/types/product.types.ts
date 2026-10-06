import type { PRODUCT_CATEGORIES } from "../schemas/product.schemas.js";

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: string;
  category: ProductCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindProductsResult {
  products: Product[];
  total: number;
}