import type { EventBus } from "../../../infrastructure/events/EventBus.js";
import type { WebSocketServer } from "../../../infrastructure/websocket/WebSocketServer.js";
import type { OrderRepository } from "../../orders/repositories/OrderRepository.js";
import type { UserRepository } from "../../users/repositories/UserRepository.js";
import type { NotificationService } from "../services/NotificationService.js";
import type { CreateNotificationInput } from "../types/notification.types.js";

export const registerNotificationHandlers = (
  eventBus: EventBus,
  notificationService: NotificationService,
  orderRepository: OrderRepository,
  userRepository: UserRepository,
  websocketServer: WebSocketServer,
): void => {
  const createAndEmitNotification = async (
    input: CreateNotificationInput,
  ): Promise<void> => {
    const notification = await notificationService.create(input);

    websocketServer.emitToUser(notification.userId, notification);
  };

  eventBus.subscribe("payment.completed", async (event) => {
    const { orderId, paymentId, userId } = event.payload;
    console.log(
      "registerNotificationHandlers : payment.completed : EVENT",
      event,
    );
    await createAndEmitNotification({
      userId: userId,
      type: "payment.completed",
      title: "Payment successful",
      message: "Your payment was successfully completed.",
      data: {
        orderId: orderId,
        paymentId: paymentId,
      },
    });
    const staff = await userRepository.findByRoles(["admin", "warehouse"]);
    for (const user of staff) {
      const isAdmin = user.role === "admin";
      await createAndEmitNotification({
        userId: user.id,
        type: "payment.completed",
        title: isAdmin ? "New paid order" : "New order to fulfill",
        message: isAdmin
          ? "A new order has been created and paid."
          : "A new paid order is ready for fulfillment.",
        data: {
          orderId,
          paymentId,
        },
      });
    }
  });
  eventBus.subscribe("fulfillment.shipped", async (event) => {
    console.log(
      "registerNotificationHandlers : fulfillment.shipped : EVENT",
      event,
    );
    const { orderId, fulfillmentId } = event.payload;

    const order = await orderRepository.findById(orderId);

    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    await createAndEmitNotification({
      userId: order.userId,
      type: "fulfillment.shipped",
      title: "Order shipped",
      message: "Your order has been shipped.",
      data: {
        orderId,
        fulfillmentId,
      },
    });
  });
  eventBus.subscribe("fulfillment.delivered", async (event) => {
    console.log(
      "registerNotificationHandlers : fulfillment.delivered : EVENT",
      event,
    );
    const { orderId, fulfillmentId } = event.payload;

    const order = await orderRepository.findById(orderId);

    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }
    await createAndEmitNotification({
      userId: order.userId,
      type: "fulfillment.delivered",
      title: "Order delivered",
      message: "Your order has been delivered.",
      data: {
        orderId,
        fulfillmentId,
      },
    });
  });
  eventBus.subscribe("order.cancelled", async (event) => {
    console.log(
      "registerNotificationHandlers : order.cancelled : EVENT",
      event,
    );
    const { orderId, userId } = event.payload;
    await createAndEmitNotification({
      userId: userId,
      type: "order.cancelled",
      title: "Order cancelled",
      message: "Your order has been cancelled.",
      data: {
        orderId,
      },
    });
  });
};
