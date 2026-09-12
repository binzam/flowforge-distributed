import type { DomainEvent } from "../../../infrastructure/events/Event.js";

export interface FulfillmentDeliveredPayload {
  fulfillmentId: string;
  orderId: string;
}

export class FulfillmentDeliveredEvent implements DomainEvent {
  readonly type = "fulfillment.delivered";
  readonly occurredAt = new Date();

  constructor(readonly payload: FulfillmentDeliveredPayload) {}
}
