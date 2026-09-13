import type { EventBus } from "../../../infrastructure/events/EventBus.js";
import type { OrderRepository } from "../repositories/OrderRepository.js";
import type { InventoryService } from "../../inventory/services/InventoryService.js";

export const registerOrderCancelledHandler = (
  eventBus: EventBus,
  orderRepository: OrderRepository,
  inventoryService: InventoryService,
): void => {
  eventBus.subscribe("order.cancelled", async (event) => {
    const { orderId } = event.payload;
    console.log(
      "registerOrderCancelledHandler : order.cancelled : EVENT",
      event,
    );
    const order = await orderRepository.findById(orderId);

    if (!order) {
      console.error(`order.cancelled: order ${orderId} not found`);
      return;
    }

    try {
      await inventoryService.releaseStock(order);

      console.log(`order.cancelled: inventory released for order ${orderId}`);
    } catch (error) {
      console.error(
        `order.cancelled: failed to release inventory for order ${orderId}`,
        error,
      );
    }
  });
};
