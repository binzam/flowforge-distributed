export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
}

export interface ProductResponse {
  data: Product;
}

export interface ProductPayload {
  name: string;
  description?: string | null;
  sku: string;
  price: string;
}

export type UpdateProductPayload = Partial<ProductPayload>;
