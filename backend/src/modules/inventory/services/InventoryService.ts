import { AppError } from "../../../errors/AppError.js";
import type { OrderWithItems } from "../../orders/types/order.types.js";
import type { InventoryRepository } from "../repositories/InventoryRepository.js";
import type {
  Inventory,
} from "../types/inventory.types.js";

export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async getInventory(productId: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findByProductId(productId);

    if (!inventory) {
      throw new AppError("Inventory not found", 404);
    }

    return inventory;
  }

  async createInventory(
    productId: string,
    quantity: number,
  ): Promise<Inventory> {
    if (quantity < 0) {
      throw new AppError("Quantity cannot be negative", 400);
    }

    const existing = await this.inventoryRepository.findByProductId(productId);

    if (existing) {
      throw new AppError("Inventory already exists for this product", 409);
    }

    return this.inventoryRepository.create({
      productId,
      quantity,
    });
  }

  async updateStock(productId: string, quantity: number): Promise<Inventory> {
    if (quantity < 0) {
      throw new AppError("Quantity cannot be negative", 400);
    }

    const inventory = await this.inventoryRepository.findByProductId(productId);

    if (!inventory) {
      throw new AppError("Inventory not found", 404);
    }

    if (quantity < inventory.reservedQuantity) {
      throw new AppError(
        "Stock quantity cannot be less than reserved quantity",
        409,
      );
    }

    const updated = await this.inventoryRepository.update(productId, {
      quantity,
    });

    if (!updated) {
      throw new AppError("Inventory not found", 404);
    }

    return updated;
  }

  async reserveStock(order: OrderWithItems): Promise<Inventory[]> {
    if (order.items.length === 0) {
      throw new AppError(
        "At least one item is required for a reservation",
        400,
      );
    }

    return this.inventoryRepository.reserveStock(
      order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    );
  }

  async releaseStock(order: OrderWithItems): Promise<Inventory[]> {
    if (order.items.length === 0) {
      throw new AppError(
        "Cannot release inventory for an order with no items",
        400,
      );
    }

    return this.inventoryRepository.releaseStock(
      order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    );
  }
}
