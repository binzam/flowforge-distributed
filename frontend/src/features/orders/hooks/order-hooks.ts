import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import {
  createOrder,
  getMyOrders,
  getOrder,
  getOrders,
  updateOrderStatus,
} from "../services/order-services";
import type {
  CreateOrderInput,
  OrderStatus,
  OrdersQuery,
} from "../types/order-types";

export const useGetMyOrders = (query: OrdersQuery) =>
  useQuery({
    queryKey: ["orders", "mine", query],
    queryFn: () => getMyOrders(query),
  });

export const useGetOrders = (query: OrdersQuery) =>
  useQuery({
    queryKey: ["orders", "all", query],
    queryFn: () => getOrders(query),
  });

export const useGetOrder = (id: string) =>
  useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
  });

export const useCreateOrder = () =>
  useMutation({
    mutationFn: (input: CreateOrderInput) => createOrder(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

export const useUpdateOrderStatus = () =>
  useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: (response) => {
      queryClient.setQueryData(["orders", response.data.id], response);
      queryClient.invalidateQueries({ queryKey: ["orders", "all"] });
    },
  });
