import { apiClient } from "@/lib/api-client";
import type {
  InventoriesResponse,
  InventoriesQuery,
  InventoryResponse,
} from "../types/inventory-types";

export const getInventories = async (query: InventoriesQuery = {}) => {
  const response = await apiClient.get<InventoriesResponse>("/inventory", {
    params: query,
  });
  return response.data;
};

export const getInventoryByProductId = async (productId: string) => {
  const response = await apiClient.get<InventoryResponse>(
    `/inventory/${productId}`,
  );
  return response.data;
};
