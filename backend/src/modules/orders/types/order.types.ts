export type OrderStatus =
  | "pending"
  | "payment_pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "failed";

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  createdAt: Date;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface CreateOrderItemRecord {
  productId: string;
  quantity: number;
  unitPrice: string;
}

export interface FindOrdersResult {
  orders: Order[];
  total: number;
}
