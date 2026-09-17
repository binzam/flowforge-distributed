export const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "successful",
  "failed",
  "cancelled",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface PaymentsQuery {
  status?: PaymentStatus;
  limit?: number;
  offset?: number;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: string;
  status: string;
  provider: string;
  providerPaymentId: string;
  createdAt: string;
  updatedAt: string;
}
export interface PaymentsResponse {
  data: Payment[];
  total: number;
  limit: number | null;
  offset: number | null;
}
