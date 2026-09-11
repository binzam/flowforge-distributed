import type { Request, Response } from "express";
import type { FulfillmentService } from "../services/FulfillmentService.js";
import type {
  FulfillmentIdParam,
  GetFulfillmentsQuery,
  UpdateFulfillmentStatusInput,
} from "../schemas/fulfillment.schemas.js";

export class FulfillmentController {
  constructor(private readonly fulfillmentService: FulfillmentService) {}

  getFulfillments = async (
    _req: Request,
    res: Response<unknown, { validated: GetFulfillmentsQuery }>,
  ) => {
    const query = res.locals.validated;

    const { fulfillments, total } =
      await this.fulfillmentService.getFulfillments(query);

    res.json({
      status: "success",
      data: fulfillments,
      total,
    });
  };
  getFulfillment = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    const fulfillment = await this.fulfillmentService.getFulfillment(id);

    res.json({
      status: "success",
      data: fulfillment,
    });
  };

  getFulfillmentByOrderId = async (
    req: Request<{ orderId: string }>,
    res: Response,
  ): Promise<void> => {
    const { orderId } = req.params;

    const fulfillment =
      await this.fulfillmentService.getFulfillmentByOrderId(orderId);

    res.json({
      status: "success",
      data: fulfillment,
    });
  };

  updateStatus = async (
    req: Request<FulfillmentIdParam, unknown, UpdateFulfillmentStatusInput>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    const fulfillment = await this.fulfillmentService.updateStatus(id, status);

    res.json({
      status: "success",
      data: fulfillment,
    });
  };
}
