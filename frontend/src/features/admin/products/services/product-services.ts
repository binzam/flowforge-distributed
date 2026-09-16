import { apiClient } from "@/lib/api-client";
import type {
  ProductPayload,
  ProductResponse,
  ProductsResponse,
  UpdateProductPayload,
} from "../types/product-types";

export const getProducts = async (): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>("/products");
  return response.data;
};

export const getProductById = async (id: string): Promise<ProductResponse> => {
  const response = await apiClient.get<ProductResponse>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (
  payload: ProductPayload,
): Promise<ProductResponse> => {
  const response = await apiClient.post<ProductResponse>("/products", payload);
  return response.data;
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload,
): Promise<ProductResponse> => {
  const response = await apiClient.patch<ProductResponse>(
    `/products/${id}`,
    payload,
  );
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};
