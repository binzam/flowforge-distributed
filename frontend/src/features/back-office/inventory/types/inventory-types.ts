export interface Inventory {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoriesResponse {
  data: Inventory[];
  total: number;
  limit: number | null;
  offset: number | null;
}

export interface InventoryResponse {
  data: Inventory;
}

export interface InventoriesQuery {
  productId?: string;
  limit?: number;
  offset?: number;
}
