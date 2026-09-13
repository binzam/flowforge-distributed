import type { Request, Response } from "express";
import type { OrderService } from "../services/OrderService.js";
import {
  toPublicOrder,
  toPublicOrderSummary,
  toPublicOrderWithItems,
} from "../mapper/orderMapper.js";
import { AppError } from "../../../errors/AppError.js";
import type {
  CreateOrderInput,
  GetMyOrdersQuery,
  GetOrdersQuery,
  UpdateOrderStatusInput,
} from "../schemas/order.schemas.js";

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  create = async (
    req: Request<Record<string, never>, unknown, CreateOrderInput>,
    res: Response,
  ): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const order = await this.orderService.createOrder(req.user.id, req.body);

    res.status(201).json({
      data: toPublicOrderWithItems(order),
    });
  };

  getById = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const order = await this.orderService.getOrderByIdWithDetails(
      req.params.id,
      req.user.id,
      req.user.role,
    );

    res.status(200).json({
      data: toPublicOrderSummary(order),
    });
  };

  // Admin/warehouse listing across all users' orders.
  getAll = async (
    _req: Request,
    res: Response<unknown, { validated: GetOrdersQuery }>,
  ): Promise<void> => {
    const query = res.locals.validated;

    const { orders, total } = await this.orderService.getOrders(query);

    res.status(200).json({
      data: orders.map(toPublicOrderSummary),
      total,
      limit: query.limit ?? null,
      offset: query.offset ?? null,
    });
  };

  // Customer's own orders — userId is forced from the session
  getMine = async (
    req: Request,
    res: Response<unknown, { validated: GetMyOrdersQuery }>,
  ): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const query: GetOrdersQuery = {
      ...res.locals.validated,
      userId: req.user.id,
    };

    const { orders, total } = await this.orderService.getOrders(query);

    res.status(200).json({
      data: orders.map(toPublicOrderSummary),
      total,
      limit: query.limit ?? null,
      offset: query.offset ?? null,
    });
  };

  updateStatus = async (
    req: Request<{ id: string }, unknown, UpdateOrderStatusInput>,
    res: Response,
  ): Promise<void> => {
    const order = await this.orderService.updateStatus(
      req.params.id,
      req.body.status,
    );

    res.status(200).json({
      data: toPublicOrder(order),
    });
  };

  cancelOrder = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    const user = req.user;
    console.log("order controller: cancel order : user", user);
    const order = await this.orderService.cancelOrder(
      req.params.id,
      user.id,
      user.role,
    );
    console.log("order controller: cancel order : order", order);

    res.status(200).json(order);
  };
}
