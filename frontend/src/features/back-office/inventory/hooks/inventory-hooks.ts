import { useQuery } from "@tanstack/react-query";
import {
  getInventories,
  getInventoryByProductId,
} from "../services/inventory-services";
import type { InventoriesQuery } from "../types/inventory-types";

export const useGetInventories = (query: InventoriesQuery = {}) =>
  useQuery({
    queryKey: ["inventory", "all", query],
    queryFn: () => getInventories(query),
  });

export const useGetInventory = (productId: string) =>
  useQuery({
    queryKey: ["inventory", productId],
    queryFn: () => getInventoryByProductId(productId),
    enabled: Boolean(productId),
  });
