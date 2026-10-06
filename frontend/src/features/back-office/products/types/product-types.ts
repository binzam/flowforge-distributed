import type { ProductCategory } from "../constants/product-categories";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: string;
  category: ProductCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsParams {
  category?: ProductCategory;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  limit: number;
  offset: number;
}

export interface ProductResponse {
  data: Product;
}

export interface ProductPayload {
  name: string;
  description?: string | null;
  sku: string;
  price: string;
  category: ProductCategory;
}

export type UpdateProductPayload = Partial<ProductPayload>;
