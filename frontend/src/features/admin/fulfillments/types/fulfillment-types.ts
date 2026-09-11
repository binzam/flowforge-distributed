export type FulfillmentStatus =
  | "pending"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number | string;
}

export interface FulfillmentListItem {
  id: string;
  orderId: string;
  status: FulfillmentStatus;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Fulfillment {
  id: string;
  orderId: string;
  status: FulfillmentStatus;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface FulfillmentsResponse {
  data: FulfillmentListItem[];
  total: number;
  limit: number | null;
  offset: number | null;
}

export interface FulfillmentResponse {
  data: Fulfillment;
}

export interface GetFulfillmentsQuery {
  status?: FulfillmentStatus;
  limit?: number;
  offset?: number;
}

export interface UpdateFulfillmentStatusInput {
  status: FulfillmentStatus;
}
