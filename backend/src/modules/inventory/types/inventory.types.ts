export interface Inventory {
  id: string;
  productId: string;
  quantity: number;
  reservedQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInventoryRecord {
  productId: string;
  quantity: number;
}

export interface UpdateInventoryRecord {
  quantity: number;
}

export interface InventoryReservationItem {
  productId: string;
  quantity: number;
}
