import type { EventBus } from "../../../infrastructure/events/EventBus.js";
import type { OrderService } from "../../orders/services/OrderService.js";
import type { FulfillmentService } from "../../fulfillments/services/FulfillmentService.js";
import { InventoryReleasedEvent } from "./InventoryReleasedEvent.js";

export const registerInventoryReservedHandler = (
  eventBus: EventBus,
  orderService: OrderService,
  fulfillmentService: FulfillmentService,
): void => {
  eventBus.subscribe("inventory.reserved", async (event) => {
    const { orderId } = event.payload;
    console.log(
      "registerInventoryReservedHandler: inventory.reserved : EVENT",
      event,
    );
    try {
      await orderService.markProcessing(orderId);
      await fulfillmentService.createFulfillment(orderId);

      console.log(
        `inventory.reserved: fulfillment created for order ${orderId}`,
      );
    } catch (error) {
      console.error(
        `inventory.reserved: fulfillment creation failed for order ${orderId}`,
        error,
      );

      await orderService.markFailed(orderId);

      eventBus.publish(
        new InventoryReleasedEvent({
          orderId,
        }),
      );
    }
  });
};
