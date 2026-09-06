import type { Order, OrderWithItems } from "../types/order.types.js";

export const toPublicOrder = (order: Order) => order;

export const toPublicOrderWithItems = (order: OrderWithItems) => order;
