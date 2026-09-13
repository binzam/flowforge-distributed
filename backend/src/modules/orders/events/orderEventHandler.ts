import type { EventBus } from "../../../infrastructure/events/EventBus.js";
import type { OrderEventRepository } from "./OrderEventRepository.js";

export const registerOrderEventHandler = (
  eventBus: EventBus,
  orderEventRepository: OrderEventRepository,
): void => {
  const eventTypes = [
    "payment.completed",
    "inventory.reserved",
    "inventory.released",
    "fulfillment.shipped",
    "fulfillment.delivered",
    "order.cancelled",
  ] as const;

  for (const eventType of eventTypes) {
    eventBus.subscribe(eventType, async (event) => {
      const { orderId } = event.payload;
      console.log(
        `registerOrderEventHandler :eventType: ${eventType} : EVENT: ${event}`,
      );
      await orderEventRepository.create(
        orderId,
        event.type,
        event.payload as unknown as Record<string, unknown>,
        event.occurredAt,
      );
    });
  }
};
