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

export interface GetProductsResponse {
  data: Product[];
}
