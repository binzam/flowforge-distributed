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
export interface OrderCustomer {
  id: string;
  name: string;
}

export interface OrderSummaryProduct {
  id: string;
  name: string;
  sku: string;
}
export interface OrderSummaryItem {
  product: OrderSummaryProduct;
  quantity: number;
  unitPrice: string;
}

export interface OrderSummary {
  id: string;
  customer: OrderCustomer;
  status: OrderStatus;
  totalAmount: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderSummaryItem[];
}
export interface FindOrdersResult {
  orders: OrderSummary[];
  total: number;
}

export interface OrderWithCustomerRow {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
  customerName: string;
}

export interface OrderItemWithProductRow {
  orderId: string;
  quantity: number;
  unitPrice: string;
  productId: string;
  productName: string;
  productSku: string;
}
