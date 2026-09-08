import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { queryClient } from "@/lib/query-client";
import {
  getPaymentForOrder,
  initializePayment,
} from "../services/payment-services";
import type {
  InitializePaymentInput,
  PaymentStatus,
} from "../types/payment-types";

const SETTLED_STATUSES: PaymentStatus[] = ["successful", "failed", "cancelled"];

const isNotFoundError = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 404;

export const getPaymentErrorMessage = (error: unknown): string => {
  if (
    isAxiosError(error) &&
    typeof error.response?.data?.message === "string"
  ) {
    return error.response.data.message;
  }
  return "Something went wrong starting the payment. Please try again.";
};

export const useInitializePayment = () =>
  useMutation({
    mutationFn: (input: InitializePaymentInput) => initializePayment(input),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.orderId],
      });
    },
  });

export const useGetPaymentForOrder = (orderId: string, enabled = true) =>
  useQuery({
    queryKey: ["payments", "order", orderId],
    queryFn: () => getPaymentForOrder(orderId),
    enabled: Boolean(orderId) && enabled,
    retry: (failureCount, error) => {
      if (isNotFoundError(error)) return false;
      return failureCount < 2;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.data.status;
      if (!status || SETTLED_STATUSES.includes(status)) return false;
      return 2500;
    },
  });
