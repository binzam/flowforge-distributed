import { AppError } from "../../../errors/AppError.js";
import type { UserRole } from "../../users/types/user.types.js";
import type { OrderRepository } from "../repositories/OrderRepository.js";
import type {
  CreateOrderInput,
  GetOrdersQuery,
} from "../schemas/order.schemas.js";
import type {
  Order,
  OrderStatus,
  OrderSummary,
  OrderWithItems,
} from "../types/order.types.js";

const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["payment_pending", "cancelled"],
  payment_pending: ["paid", "failed", "cancelled"],
  paid: ["processing", "failed", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
  failed: ["payment_pending"],
};

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(
    userId: string,
    input: CreateOrderInput,
  ): Promise<OrderWithItems> {
    const productIds = input.items.map((item) => item.productId);
    const prices = await this.orderRepository.findProductPrices(productIds);

    const priceById = new Map(prices.map((p) => [p.id, p.price]));

    const missing = productIds.filter((id) => !priceById.has(id));
    if (missing.length > 0) {
      throw new AppError(`Unknown product id(s): ${missing.join(", ")}`, 400);
    }

    const items = input.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: priceById.get(item.productId)!,
    }));

    return this.orderRepository.createWithItems(userId, items);
  }

  async getOrderByIdWithDetails(
    id: string,
    requestingUserId: string,
    requestingUserRole: UserRole,
  ): Promise<OrderSummary> {
    const order = await this.orderRepository.findByIdWithDetails(id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const canViewAny =
      requestingUserRole === "admin" || requestingUserRole === "warehouse";

    if (!canViewAny && order.customer.id !== requestingUserId) {
      throw new AppError("Order not found", 404);
    }

    return order;
  }

  async getOrderById(
    id: string,
    requestingUserId: string,
    requestingUserRole: UserRole,
  ): Promise<OrderWithItems> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const canViewAny =
      requestingUserRole === "admin" || requestingUserRole === "warehouse";

    if (!canViewAny && order.userId !== requestingUserId) {
      throw new AppError("Order not found", 404);
    }

    return order;
  }

  async getOrders(options: GetOrdersQuery) {
    return this.orderRepository.findAll(options);
  }

  async updateStatus(id: string, nextStatus: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    console.log("order service: updatestatus: order", order);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const allowedNext = ALLOWED_STATUS_TRANSITIONS[order.status];

    if (!allowedNext.includes(nextStatus)) {
      throw new AppError(
        `Cannot transition order from "${order.status}" to "${nextStatus}"`,
        409,
      );
    }

    const updated = await this.orderRepository.updateStatus(id, nextStatus);

    if (!updated) {
      throw new AppError("Order not found", 404);
    }

    return updated;
  }

  async markAsPaid(id: string): Promise<Order> {
    console.log(
      "order service: markaspaid: markaspaid called for orderid:",
      id,
    );

    return this.updateStatus(id, "paid");
  }

  async markProcessing(id: string): Promise<Order> {
    console.log(
      "order service: markProcessing: markProcessing called for orderid:",
      id,
    );

    return this.updateStatus(id, "processing");
  }

  async markFailed(orderId: string): Promise<Order> {
    console.log(
      "order service: markFailed: markFailed called for orderid:",
      orderId,
    );

    return this.updateStatus(orderId, "failed");
  }
}
