import type { EventBus } from "../../../infrastructure/events/EventBus.js";
import type { OrderRepository } from "../../orders/repositories/OrderRepository.js";
import type { OrderService } from "../../orders/services/OrderService.js";
import type { InventoryService } from "../../inventory/services/InventoryService.js";
import { InventoryReservedEvent } from "../../inventory/events/InventoryReservedEvent.js";

// EVENT: payment.completed
//        │
//        ▼
//          PaymentCompletedHandler
//              │
//              ├── load order
//              ├── reserve inventory
//                         |
//                         ▼
//              EVENT: inventory.reserved

export const registerPaymentCompletedHandler = (
  eventBus: EventBus,
  orderRepository: OrderRepository,
  orderService: OrderService,
  inventoryService: InventoryService,
): void => {
  eventBus.subscribe("payment.completed", async (event) => {
    const { orderId } = event.payload;
    console.log(
      "registerPaymentCompletedHandler: payment.completed : EVENT",
      event,
    );
    const order = await orderRepository.findById(orderId);

    if (!order) {
      console.error(`payment.completed: order ${orderId} not found`);
      return;
    }

    try {
      await inventoryService.reserveStock(order);

      eventBus.publish(
        new InventoryReservedEvent({
          orderId,
        }),
      );
    } catch (error) {
      console.error(
        `payment.completed: stock reservation or fulfillment failed for order ${orderId}`,
        error,
      );

      await orderService.markFailed(orderId);

      // TODO: refund payment
    }
  });
};
