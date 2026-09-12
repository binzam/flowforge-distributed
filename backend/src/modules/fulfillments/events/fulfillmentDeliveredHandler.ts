import type { EventBus } from "../../../infrastructure/events/EventBus.js";
import type { OrderService } from "../../orders/services/OrderService.js";

export const registerFulfillmentDeliveredHandler = (
  eventBus: EventBus,
  orderService: OrderService,
): void => {
  eventBus.subscribe("fulfillment.delivered", async (event) => {
    const { orderId } = event.payload;
    console.log(
      "registerFulfillmentDeliveredHandler: fulfillment.delivered : EVENT",
      event,
    );

    try {
      await orderService.updateStatus(orderId, "delivered");

      console.log(
        `fulfillment.delivered: order ${orderId} marked as delivered`,
      );
    } catch (error) {
      console.error(
        `fulfillment.delivered: failed to mark order ${orderId} as delivered`,
        error,
      );
    }
  });
};
