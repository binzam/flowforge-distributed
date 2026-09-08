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

export interface InitializePaymentResult {
  payment: Payment;
  checkoutUrl: string;
}

export interface PayerDetails {
  email: string;
  firstName: string | undefined;
  lastName: string | undefined;
}
