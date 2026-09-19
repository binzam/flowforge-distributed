import { pool } from "../database/index.js";
import { eventBus } from "../infrastructure/events/eventBusInstance.js";
import { OrderRepository } from "../modules/orders/repositories/OrderRepository.js";
import { OrderService } from "../modules/orders/services/OrderService.js";
import { InventoryRepository } from "../modules/inventory/repositories/InventoryRepository.js";
import { InventoryService } from "../modules/inventory/services/InventoryService.js";
import { FulfillmentRepository } from "../modules/fulfillments/repositories/FulfillmentRepository.js";
import { FulfillmentService } from "../modules/fulfillments/services/FulfillmentService.js";
import { registerPaymentCompletedHandler } from "../modules/payments/events/paymentCompletedHandler.js";
import { registerInventoryReservedHandler } from "../modules/inventory/events/inventoryReservedHandler.js";
import { registerFulfillmentShippedHandler } from "../modules/fulfillments/events/fulfillmentShippedHandler.js";
import { registerFulfillmentDeliveredHandler } from "../modules/fulfillments/events/fulfillmentDeliveredHandler.js";
import { registerOrderCancelledHandler } from "../modules/orders/events/orderCancelledHandler.js";
import { registerInventoryReleasedHandler } from "../modules/inventory/events/inventoryReleasedHandler.js";
import { OrderEventRepository } from "../modules/orders/events/OrderEventRepository.js";
import { registerOrderEventHandler } from "../modules/orders/events/orderEventHandler.js";
import { UserRepository } from "../modules/users/repositories/UserRepository.js";
import { NodemailerEmailProvider } from "../infrastructure/email/NodemailerEmailProvider.js";
import { EmailService } from "../infrastructure/email/EmailService.js";
import { registerNotificationHandlers } from "../modules/notifications/events/notificationHandlers.js";
import { NotificationService } from "../modules/notifications/services/NotificationService.js";
import { NotificationRepository } from "../modules/notifications/repositories/NotificationRepository.js";

export const registerEventHandlers = (): void => {
  const orderRepository = new OrderRepository(pool);
  const orderEventRepository = new OrderEventRepository(pool);
  const userRepository = new UserRepository(pool);
  const inventoryRepository = new InventoryRepository(pool);
  const fulfillmentRepository = new FulfillmentRepository(pool);
  const notificationRepository = new NotificationRepository(pool);

  const orderService = new OrderService(orderRepository, eventBus);
  const inventoryService = new InventoryService(inventoryRepository);
  const fulfillmentService = new FulfillmentService(
    fulfillmentRepository,
    eventBus,
  );
  const notificationService = new NotificationService(notificationRepository);

  const emailProvider = new NodemailerEmailProvider();
  const emailService = new EmailService(emailProvider);

  registerPaymentCompletedHandler(
    eventBus,
    orderRepository,
    userRepository,
    orderService,
    inventoryService,
    emailService,
  );

  registerInventoryReservedHandler(eventBus, orderService, fulfillmentService);

  registerInventoryReleasedHandler(eventBus, orderRepository, inventoryService);

  registerFulfillmentShippedHandler(eventBus, orderService);

  registerFulfillmentDeliveredHandler(eventBus, orderService);

  registerOrderCancelledHandler(eventBus, orderRepository, inventoryService);

  registerOrderEventHandler(eventBus, orderEventRepository);

  registerNotificationHandlers(eventBus, notificationService, orderRepository, userRepository);
};
