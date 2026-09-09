import { AppError } from "../../../errors/AppError.js";
import type { PaymentProvider } from "../../../infrastructure/payments/PaymentProvider.js";
import type { OrderRepository } from "../../orders/repositories/OrderRepository.js";
import type { OrderService } from "../../orders/services/OrderService.js";
import type { InventoryService } from "../../inventory/services/InventoryService.js";
import type { UserRole } from "../../users/types/user.types.js";
import type { PaymentRepository } from "../repositories/PaymentRepository.js";
import type {
  InitializePaymentResult,
  PayerDetails,
  Payment,
} from "../types/payment.types.js";

const CURRENCY = "ETB";

export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderService: OrderService,
    private readonly paymentProvider: PaymentProvider,
    private readonly inventoryService: InventoryService,
    private readonly frontendBaseUrl: string,
    private readonly apiBaseUrl: string,
  ) {}

  async initializePayment(
    orderId: string,
    requestingUserId: string,
    payer: PayerDetails,
  ): Promise<InitializePaymentResult> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.userId !== requestingUserId) {
      throw new AppError("Order not found", 404);
    }
    if (
      order.status !== "pending" &&
      order.status !== "payment_pending" &&
      order.status !== "failed"
    ) {
      throw new AppError(
        `Order is not payable in its current status ("${order.status}")`,
        409,
      );
    }

    const txRef = `ff-${orderId}-`;

    const payment = await this.paymentRepository.upsertForOrder(
      orderId,
      order.totalAmount,
      "chapa",
      txRef,
    );

    if (!payment) {
      throw new AppError("Order already paid", 409);
    }

    const { checkoutUrl } = await this.paymentProvider.initialize({
      amount: order.totalAmount,
      currency: CURRENCY,
      txRef,
      email: payer.email,
      firstName: payer.firstName ?? "",
      lastName: payer.lastName ?? "",
      callbackUrl: `${this.apiBaseUrl}/payments/callback`,
      returnUrl: `${this.frontendBaseUrl}/orders/${orderId}`,
    });

    if (order.status !== "payment_pending") {
      await this.orderService.updateStatus(orderId, "payment_pending");
    }

    return { payment, checkoutUrl };
  }

  async getPaymentForOrder(
    orderId: string,
    requestingUserId: string,
    requestingUserRole: UserRole,
  ): Promise<Payment> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const canViewAny =
      requestingUserRole === "admin" || requestingUserRole === "warehouse";

    if (!canViewAny && order.userId !== requestingUserId) {
      throw new AppError("Order not found", 404);
    }

    const payment = await this.paymentRepository.findByOrderId(orderId);

    if (!payment) {
      throw new AppError("No payment found for this order", 404);
    }

    return payment;
  }

  async confirmPayment(txRef: string): Promise<void> {
    const payment = await this.paymentRepository.findByProviderPaymentId(txRef);

    if (!payment) {
      throw new AppError(`Unknown payment reference: ${txRef}`, 404);
    }

    if (payment.status === "successful" || payment.status === "failed") {
      return;
    }

    const verified = await this.paymentProvider.verify(txRef);

    if (
      verified.txRef !== txRef ||
      Number(verified.amount) !== Number(payment.amount)
    ) {
      throw new AppError(
        "Verified payment details do not match the recorded payment",
        409,
      );
    }

    if (verified.status === "success") {
      await this.paymentRepository.updateStatus(payment.id, "successful");
      await this.orderService.markAsPaid(payment.orderId);
      await this.fulfillOrder(payment.orderId);
    } else {
      await this.paymentRepository.updateStatus(payment.id, "failed");
      await this.orderService.updateStatus(payment.orderId, "failed");
    }
  }

  private async fulfillOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      console.error(`fulfillOrder: order ${orderId} not found after paid`);
      return;
    }

    try {
      await this.inventoryService.reserveStock(order);
      await this.orderService.markProcessing(orderId);
    } catch (error) {
      console.error(
        `fulfillOrder: stock reservation failed for order ${orderId}, refund required`,
        error,
      );
      await this.orderService.updateStatus(orderId, "failed");
      // TODO: this is where refund will be implmented
    }
  }
}
