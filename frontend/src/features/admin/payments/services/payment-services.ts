import { apiClient } from "@/lib/api-client";
import type { PaymentsQuery, PaymentsResponse } from "../types/payment-types";

export const getPayments = async (query: PaymentsQuery = {}) => {
  const response = await apiClient.get<PaymentsResponse>("/payments", {
    params: query,
  });
  return response.data;
};
