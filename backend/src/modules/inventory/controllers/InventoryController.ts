import type { Request, Response } from "express";
import type { InventoryService } from "../services/InventoryService.js";
import type {
  CreateInventoryInput,
  GetInventoriesQuery,
  InventoryProductIdParam,
  UpdateInventoryInput,
} from "../schemas/inventory.schemas.js";

export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  getInventories = async (
    _req: Request,
    res: Response<unknown, { validated: GetInventoriesQuery }>,
  ): Promise<void> => {
    const query = res.locals.validated;
    const { inventories, total } =
      await this.inventoryService.getInventories(query);

    res.status(200).json({
      data: inventories,
      total,
      limit: query.limit ?? null,
      offset: query.offset ?? null,
    });
  };

  getInventory = async (
    req: Request<{ productId: string }>,
    res: Response,
  ): Promise<void> => {
    const { productId } = req.params;

    const inventory = await this.inventoryService.getInventory(productId);

    res.status(200).json({
      status: "success",
      data: inventory,
    });
  };

  createInventory = async (
    req: Request<InventoryProductIdParam, unknown, CreateInventoryInput>,
    res: Response,
  ): Promise<void> => {
    const { productId } = req.params;
    const { quantity } = req.body;

    const inventory = await this.inventoryService.createInventory(
      productId,
      quantity,
    );

    res.status(201).json({
      status: "success",
      data: inventory,
    });
  };

  updateStock = async (
    req: Request<InventoryProductIdParam, unknown, UpdateInventoryInput>,
    res: Response,
  ): Promise<void> => {
    const { productId } = req.params;
    const { quantity } = req.body;

    const inventory = await this.inventoryService.updateStock(
      productId,
      quantity,
    );

    res.status(200).json({
      status: "success",
      data: inventory,
    });
  };
}
