import type { EventBus } from "../../../infrastructure/events/EventBus.js";
import type { EmailService } from "../../../infrastructure/email/EmailService.js";
import type { UserRepository } from "../../users/repositories/UserRepository.js";
import type { OrderRepository } from "../../orders/repositories/OrderRepository.js";
import type { OrderService } from "../../orders/services/OrderService.js";
import type { InventoryService } from "../../inventory/services/InventoryService.js";
import { InventoryReservedEvent } from "../../inventory/events/InventoryReservedEvent.js";
import { paymentConfirmationEmail } from "../../../infrastructure/email/templates/paymentConfirmationEmail.js";
import { config } from "../../../config/env.js";

// EVENT: payment.completed
//        │
//        ▼
// PaymentCompletedHandler
//        │
//        ├── load order
//        │
//        ├── reserve inventory
//        │        │
//        │        ▼
//        │   EVENT: inventory.reserved
//        │
//        └── send payment confirmation email

export const registerPaymentCompletedHandler = (
  eventBus: EventBus,
  orderRepository: OrderRepository,
  userRepository: UserRepository,
  orderService: OrderService,
  inventoryService: InventoryService,
  emailService: EmailService,
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

      console.log(`payment.completed: inventory reserved for order ${orderId}`);
    } catch (error) {
      console.error(
        `payment.completed: stock reservation failed for order ${orderId}`,
        error,
      );

      await orderService.markFailed(orderId);

      // TODO: refund payment

      return;
    }

    // Email is non critical so if it fails the order continues normally
    try {
      const user = await userRepository.findById(order.userId);

      if (!user) {
        console.error(`payment.completed: user ${order.userId} not found`);
        return;
      }
      const email = paymentConfirmationEmail({
        customerName: user.name,
        amount: event.payload.amount,
        orderUrl: `${config.frontend.url}/orders/${order.id}`,
      });

      await emailService.send({
        to: user.email,
        ...email,
      });

      console.log(
        `payment.completed: confirmation email sent for order ${orderId}`,
      );
    } catch (error) {
      console.error(
        `payment.completed: failed to send confirmation email for order ${orderId}`,
        error,
      );
    }
  });
};
