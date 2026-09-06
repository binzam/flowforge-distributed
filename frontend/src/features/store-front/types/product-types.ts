export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetProductsResponse {
  data: Product[];
}
