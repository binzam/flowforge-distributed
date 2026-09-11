import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateFulfillmentStatusInput;
    }) => updateFulfillmentStatus(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["fulfillments"] });
      queryClient.setQueryData(["fulfillments", data.data.id], data);
    },
  });
};
