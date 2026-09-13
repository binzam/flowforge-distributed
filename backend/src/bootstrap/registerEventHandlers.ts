import { eventBus } from "../infrastructure/events/eventBusInstance.js";
import { OrderRepository } from "../modules/orders/repositories/OrderRepository.js";
import { OrderService } from "../modules/orders/services/OrderService.js";
import { InventoryRepository } from "../modules/inventory/repositories/InventoryRepository.js";
import { InventoryService } from "../modules/inventory/services/InventoryService.js";
import { FulfillmentRepository } from "../modules/fulfillments/repositories/FulfillmentRepository.js";
import { FulfillmentService } from "../modules/fulfillments/services/FulfillmentService.js";
import { pool } from "../database/index.js";
import { registerPaymentCompletedHandler } from "../modules/payments/events/paymentCompletedHandler.js";
import { registerInventoryReservedHandler } from "../modules/inventory/events/inventoryReservedHandler.js";
import { registerFulfillmentShippedHandler } from "../modules/fulfillments/events/fulfillmentShippedHandler.js";
import { registerFulfillmentDeliveredHandler } from "../modules/fulfillments/events/fulfillmentDeliveredHandler.js";
import { registerOrderCancelledHandler } from "../modules/orders/events/orderCancelledHandler.js";
import { registerInventoryReleasedHandler } from "../modules/inventory/events/inventoryReleasedHandler.js";

export const registerEventHandlers = (): void => {
  const orderRepository = new OrderRepository(pool);
  const orderService = new OrderService(orderRepository, eventBus);

  const inventoryRepository = new InventoryRepository(pool);
  const inventoryService = new InventoryService(inventoryRepository);

  const fulfillmentRepository = new FulfillmentRepository(pool);
  const fulfillmentService = new FulfillmentService(
    fulfillmentRepository,
    eventBus,
  );

  registerPaymentCompletedHandler(
    eventBus,
    orderRepository,
    orderService,
    inventoryService,
  );

  registerInventoryReservedHandler(eventBus, orderService, fulfillmentService);

  registerInventoryReleasedHandler(eventBus, orderRepository, inventoryService);

  registerFulfillmentShippedHandler(eventBus, orderService);

  registerFulfillmentDeliveredHandler(eventBus, orderService);

  registerOrderCancelledHandler(eventBus, orderRepository, inventoryService);
};
