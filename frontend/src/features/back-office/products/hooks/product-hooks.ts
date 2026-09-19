import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../services/product-services";
import type {
  ProductPayload,
  UpdateProductPayload,
} from "../types/product-types";
import { queryClient } from "@/lib/query-client";

export const useGetProducts = () =>
  useQuery({
    queryKey: ["admin-products"],
    queryFn: getProducts,
  });

export const useGetProduct = (id: string) =>
  useQuery({
    queryKey: ["admin-products", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: (payload: ProductPayload) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductPayload;
    }) => updateProduct(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-products", variables.id],
      });
    },
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
};
