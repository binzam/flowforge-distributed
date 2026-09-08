import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { createOrder, getMyOrders, getOrder } from "../services/order-services";
import type { CreateOrderInput, OrdersQuery } from "../types/order-types";

export const useGetMyOrders = (query: OrdersQuery) =>
  useQuery({
    queryKey: ["orders", "mine", query],
    queryFn: () => getMyOrders(query),
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
