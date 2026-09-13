import { AppError } from "../../../errors/AppError.js";
import type { UserRole } from "../../users/types/user.types.js";
import type { OrderEventRepository } from "../events/OrderEventRepository.js";
import type { OrderRepository } from "../repositories/OrderRepository.js";
import type { OrderEvent } from "../events/orderEvent.types.js";

export class OrderEventService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderEventRepository: OrderEventRepository,
  ) {}

  async getOrderEvents(
    orderId: string,
    requestingUserId: string,
    requestingUserRole: UserRole,
  ): Promise<OrderEvent[]> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const canViewAny =
      requestingUserRole === "admin" || requestingUserRole === "warehouse";

    if (!canViewAny && order.userId !== requestingUserId) {
      throw new AppError("Order not found", 404);
    }

    return this.orderEventRepository.findByOrderId(orderId);
  }
}
