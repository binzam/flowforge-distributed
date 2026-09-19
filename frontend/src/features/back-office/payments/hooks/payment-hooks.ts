import { useQuery } from "@tanstack/react-query";
import { getPayments } from "../services/payment-services";
import type { PaymentsQuery } from "../types/payment-types";

export const useGetPayments = (query: PaymentsQuery) =>
  useQuery({
    queryKey: ["payments", "all", query],
    queryFn: () => getPayments(query),
  });
