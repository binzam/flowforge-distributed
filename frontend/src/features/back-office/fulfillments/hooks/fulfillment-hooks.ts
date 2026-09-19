import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getFulfillments,
  getFulfillmentById,
  getFulfillmentByOrderId,
  updateFulfillmentStatus,
} from "../services/fulfillment-services";
import type {
  GetFulfillmentsQuery,
  UpdateFulfillmentStatusInput,
} from "../types/fulfillment-types";
import { queryClient } from "@/lib/query-client";

export const useGetFulfillments = (query: GetFulfillmentsQuery = {}) =>
  useQuery({
    queryKey: ["fulfillments", "all", query],
    queryFn: () => getFulfillments(query),
  });

export const useGetFulfillment = (id: string) =>
  useQuery({
    queryKey: ["fulfillments", id],
    queryFn: () => getFulfillmentById(id),
    enabled: Boolean(id),
  });

export const useGetFulfillmentByOrderId = (orderId: string) =>
  useQuery({
    queryKey: ["fulfillments", "order", orderId],
    queryFn: () => getFulfillmentByOrderId(orderId),
    enabled: Boolean(orderId),
  });

export const useUpdateFulfillmentStatus = () => {
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateFulfillmentStatusInput;
    }) => updateFulfillmentStatus(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["fulfillments", variables.id],
      });

      queryClient.invalidateQueries({ queryKey: ["fulfillments", "all"] });
    },
  });
};
