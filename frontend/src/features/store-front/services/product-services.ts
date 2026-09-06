import { apiClient } from "../../../lib/api-client";
import type { GetProductsResponse } from "../types/product-types";

export const getProducts = async (): Promise<GetProductsResponse> => {
  const response = await apiClient.get("/products", {});
  return response.data;
};
