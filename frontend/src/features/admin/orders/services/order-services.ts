import { apiClient } from "@/lib/api-client";
import type {
  OrderResponse,
  OrdersQuery,
  OrdersResponse,
} from "../types/order-types";

export const getOrders = async (query: OrdersQuery = {}) => {
  const response = await apiClient.get<OrdersResponse>("/orders", {
    params: query,
  });
  return response.data;
};

export const getOrder = async (id: string) => {
  const response = await apiClient.get<OrderResponse>(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const response = await apiClient.patch<OrderResponse>(
    `/orders/${id}/status`,
    { status },
  );
  return response.data;
};
