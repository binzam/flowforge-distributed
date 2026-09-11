import { apiClient } from "@/lib/api-client";
import type {
  FulfillmentsResponse,
  FulfillmentResponse,
  GetFulfillmentsQuery,
  UpdateFulfillmentStatusInput,
} from "../types/fulfillment-types";

export const getFulfillments = async (query: GetFulfillmentsQuery = {}) => {
  const response = await apiClient.get<FulfillmentsResponse>("/fulfillments", {
    params: query,
  });
  return response.data;
};

export const getFulfillmentById = async (id: string) => {
  const response = await apiClient.get<FulfillmentResponse>(
    `/fulfillments/${id}`,
  );
  return response.data;
};

export const getFulfillmentByOrderId = async (orderId: string) => {
  const response = await apiClient.get<FulfillmentResponse>(
    `/fulfillments/order/${orderId}`,
  );
  return response.data;
};

export const updateFulfillmentStatus = async (
  id: string,
  input: UpdateFulfillmentStatusInput,
) => {
  const response = await apiClient.patch<FulfillmentResponse>(
    `/fulfillments/${id}/status`,
    input,
  );
  return response.data;
};
