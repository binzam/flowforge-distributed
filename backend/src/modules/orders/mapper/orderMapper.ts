import type {
  Order,
  OrderSummary,
  OrderWithItems,
} from "../types/order.types.js";

// Flat order record : used wherever the underlying query doesn't join
// customer/item details, e.g. the status-update response.
export const toPublicOrder = (order: Order) => order;

// Admin/warehouse listing shape:customer + per-item product details
export const toPublicOrderSummary = (order: OrderSummary) => order;

export const toPublicOrderWithItems = (order: OrderWithItems) => order;
