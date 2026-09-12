import type { EventBus } from "../../../infrastructure/events/EventBus.js";
import type { OrderService } from "../../orders/services/OrderService.js";

export const registerFulfillmentShippedHandler = (
  eventBus: EventBus,
  orderService: OrderService,
): void => {
  eventBus.subscribe("fulfillment.shipped", async (event) => {
    const { orderId } = event.payload;
    console.log(
      "registerFulfillmentShippedHandler: fulfillment.shipped : EVENT",
      event,
    );

    try {
      await orderService.updateStatus(orderId, "shipped");

      console.log(`fulfillment.shipped: order ${orderId} marked as shipped`);
    } catch (error) {
      console.error(
        `fulfillment.shipped: failed to mark order ${orderId} as shipped`,
        error,
      );
    }
  });
};
