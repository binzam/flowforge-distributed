import type { DomainEvent } from "../../../infrastructure/events/Event.js";

export interface InventoryReleasedPayload {
  orderId: string;
}

export class InventoryReleasedEvent implements DomainEvent {
  readonly type = "inventory.released";
  readonly occurredAt = new Date();

  constructor(readonly payload: InventoryReleasedPayload) {}
}
