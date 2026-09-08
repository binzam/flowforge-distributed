export const ORDER_STATUSES = [
  "pending",
  "payment_pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "failed",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  createdAt: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  limit: number | null;
  offset: number | null;
}

export interface OrderResponse {
  data: OrderWithItems;
}

export interface CreateOrderInput {
  items: Array<{ productId: string; quantity: number }>;
}

export interface OrdersQuery {
  status?: OrderStatus;
  userId?: string;
  limit?: number;
  offset?: number;
}
