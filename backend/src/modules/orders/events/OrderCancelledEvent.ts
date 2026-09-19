import type { DomainEvent } from "../../../infrastructure/events/Event.js";

export interface OrderCancelledPayload {
  orderId: string;
  userId: string;
}

export class OrderCancelledEvent implements DomainEvent {
  readonly type = "order.cancelled";
  readonly occurredAt = new Date();

  constructor(readonly payload: OrderCancelledPayload) {}
}
