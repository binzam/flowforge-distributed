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
  createdAt: string;
  updatedAt: string;
}

export interface InitializePaymentInput {
  orderId: string;
}

export interface InitializePaymentResponse {
  data: {
    paymentId: string;
    status: PaymentStatus;
    checkoutUrl: string;
  };
}

export interface PaymentResponse {
  data: Payment;
}
