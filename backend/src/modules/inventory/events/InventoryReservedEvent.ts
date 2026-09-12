import type { DomainEvent } from "../../../infrastructure/events/Event.js";

interface InventoryReservedPayload {
  orderId: string;
}

export class InventoryReservedEvent implements DomainEvent {
  readonly type = "inventory.reserved";
  readonly occurredAt = new Date();

  constructor(readonly payload: InventoryReservedPayload) {}
}
