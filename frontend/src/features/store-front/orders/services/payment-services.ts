import { apiClient } from "@/lib/api-client";
import type {
  InitializePaymentInput,
  InitializePaymentResponse,
  PaymentResponse,
} from "../types/payment-types";

export const initializePayment = async (input: InitializePaymentInput) => {
  const response = await apiClient.post<InitializePaymentResponse>(
    "/payments/initialize",
    input,
  );
  return response.data;
};

export const getPaymentForOrder = async (orderId: string) => {
  const response = await apiClient.get<PaymentResponse>(
    `/payments/orders/${orderId}`,
  );
  return response.data;
};
