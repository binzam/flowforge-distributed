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
interface OrderCustomer {
  id: string;
  name: string;
}
interface OrderProduct {
  id: string;
  name: string;
  sku: string;
}
interface OrderItem {
  product: OrderProduct;
  quantity: number;
  unitPrice: string;
}
export interface Order {
  id: string;
  customer: OrderCustomer;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  limit: number | null;
  offset: number | null;
}

export interface OrderResponse {
  data: Order;
}

export interface OrdersQuery {
  status?: OrderStatus;
  userId?: string;
  limit?: number;
  offset?: number;
}
