export type FulfillmentStatus =
  | "pending"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Fulfillment {
  id: string;
  orderId: string;
  status: FulfillmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface FulfillmentListItem {
  id: string;
  orderId: string;
  status: FulfillmentStatus;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindFulfillmentsResult {
  fulfillments: FulfillmentListItem[];
  total: number;
}
export interface FulfillmentItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: string;
}

export interface FulfillmentDetails extends Fulfillment {
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  items: FulfillmentItem[];
}