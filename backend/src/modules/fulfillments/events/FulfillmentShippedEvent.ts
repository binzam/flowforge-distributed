import type { DomainEvent } from "../../../infrastructure/events/Event.js";

export interface FulfillmentShippedPayload {
  fulfillmentId: string;
  orderId: string;
}

export class FulfillmentShippedEvent implements DomainEvent {
  readonly type = "fulfillment.shipped";
  readonly occurredAt = new Date();

  constructor(readonly payload: FulfillmentShippedPayload) {}
}
