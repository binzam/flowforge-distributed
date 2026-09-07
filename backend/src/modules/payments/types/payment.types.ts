export type PaymentStatus =
  | "pending"
  | "processing"
  | "successful"
  | "failed"
  | "cancelled";

export interface Payment {
  id: string;
  orderId: string;
  amount: string;
  status: PaymentStatus;
  provider: string | null;
  providerPaymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
