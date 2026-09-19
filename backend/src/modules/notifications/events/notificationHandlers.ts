import type { EventBus } from "../../../infrastructure/events/EventBus.js";
import type { OrderRepository } from "../../orders/repositories/OrderRepository.js";
import type { UserRepository } from "../../users/repositories/UserRepository.js";
import type { NotificationService } from "../services/NotificationService.js";

export const registerNotificationHandlers = (
  eventBus: EventBus,
  notificationService: NotificationService,
  orderRepository: OrderRepository,
  userRepository: UserRepository,
): void => {
  eventBus.subscribe("payment.completed", async (event) => {
    const { orderId, paymentId, userId } = event.payload;
    console.log(
      "registerNotificationHandlers : payment.completed : EVENT",
      event,
    );
    await notificationService.create({
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

      await notificationService.create({
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
    const { orderId } = event.payload;

    const order = await orderRepository.findById(orderId);

    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    await notificationService.create({
      userId: order.userId,
      type: "fulfillment.shipped",
      title: "Order shipped",
      message: "Your order has been shipped.",
      data: {
        orderId,
      },
    });
  });
  eventBus.subscribe("fulfillment.delivered", async (event) => {
    console.log(
      "registerNotificationHandlers : fulfillment.delivered : EVENT",
      event,
    );
    const { orderId } = event.payload;

    const order = await orderRepository.findById(orderId);

    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    await notificationService.create({
      userId: order.userId,
      type: "fulfillment.delivered",
      title: "Order delivered",
      message: "Your order has been delivered.",
      data: {
        orderId,
      },
    });
  });
  eventBus.subscribe("order.cancelled", async (event) => {
    console.log(
      "registerNotificationHandlers : order.cancelled : EVENT",
      event,
    );
    const { orderId, userId } = event.payload;

    await notificationService.create({
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
