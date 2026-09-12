import type { EventBus } from "../../../infrastructure/events/EventBus.js";
import type { OrderRepository } from "../../orders/repositories/OrderRepository.js";
import type { InventoryService } from "../services/InventoryService.js";

export const registerInventoryReleasedHandler = (
  eventBus: EventBus,
  orderRepository: OrderRepository,
  inventoryService: InventoryService,
): void => {
  eventBus.subscribe("inventory.released", async (event) => {
    const { orderId } = event.payload;

    const order = await orderRepository.findById(orderId);

    if (!order) {
      console.error(`inventory.released: order ${orderId} not found`);
      return;
    }

    try {
      await inventoryService.releaseStock(order);

      console.log(`inventory.released: stock released for order ${orderId}`);
    } catch (error) {
      console.error(
        `inventory.released: failed to release stock for order ${orderId}`,
        error,
      );
    }
  });
};
