import { AppError } from "../../../errors/AppError.js";
import type { FulfillmentRepository } from "../repositories/FulfillmentRepository.js";
import type { GetFulfillmentsQuery } from "../schemas/fulfillment.schemas.js";
import type {
  Fulfillment,
  FulfillmentDetails,
  FulfillmentStatus,
} from "../types/fulfillment.types.js";

const ALLOWED_STATUS_TRANSITIONS: Record<
  FulfillmentStatus,
  FulfillmentStatus[]
> = {
  pending: ["processing", "cancelled"],
  processing: ["packed", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export class FulfillmentService {
  constructor(private readonly fulfillmentRepository: FulfillmentRepository) {}

  async getFulfillments(options: GetFulfillmentsQuery = {}) {
    return this.fulfillmentRepository.findAll(options);
  }
  async createFulfillment(orderId: string): Promise<Fulfillment> {
    const existing = await this.fulfillmentRepository.findByOrderId(orderId);

    if (existing) {
      throw new AppError("Fulfillment already exists for this order", 409);
    }

    return this.fulfillmentRepository.create(orderId);
  }

  async getFulfillment(id: string): Promise<FulfillmentDetails> {
    const fulfillment = await this.fulfillmentRepository.findById(id);

    if (!fulfillment) {
      throw new AppError("Fulfillment not found", 404);
    }

    return fulfillment;
  }

  async getFulfillmentByOrderId(orderId: string): Promise<Fulfillment> {
    const fulfillment = await this.fulfillmentRepository.findByOrderId(orderId);

    if (!fulfillment) {
      throw new AppError("Fulfillment not found", 404);
    }

    return fulfillment;
  }

  async updateStatus(
    id: string,
    newStatus: FulfillmentStatus,
  ): Promise<Fulfillment> {
    const fulfillment = await this.getFulfillment(id);

    const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[fulfillment.status];

    if (!allowedTransitions.includes(newStatus)) {
      throw new AppError(
        `Cannot transition fulfillment from "${fulfillment.status}" to "${newStatus}"`,
        409,
      );
    }

    const updated = await this.fulfillmentRepository.updateStatus(
      id,
      newStatus,
    );

    if (!updated) {
      throw new AppError("Fulfillment not found", 404);
    }

    return updated;
  }
}
