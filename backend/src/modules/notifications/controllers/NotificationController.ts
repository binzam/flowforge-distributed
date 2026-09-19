import type { Request, Response } from "express";
import { AppError } from "../../../errors/AppError.js";
import type { GetNotificationsQuery } from "../schemas/notification.schemas.js";
import type { NotificationService } from "../services/NotificationService.js";

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  getAll = async (
    req: Request,
    res: Response<unknown, { validated: GetNotificationsQuery }>,
  ): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const query = res.locals.validated;

    const result = await this.notificationService.getNotifications(
      req.user.id,
      query,
    );

    res.status(200).json({
      data: result.notifications,
      total: result.total,
      unreadCount: result.unreadCount,
      limit: query.limit ?? null,
      offset: query.offset ?? null,
    });
  };

  getUnreadCount = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const unreadCount = await this.notificationService.getUnreadCount(
      req.user.id,
    );

    res.status(200).json({
      data: {
        unreadCount,
      },
    });
  };

  markAsRead = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const notification = await this.notificationService.markAsRead(
      req.params.id,
      req.user.id,
    );

    res.status(200).json({
      data: notification,
    });
  };

  markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const count = await this.notificationService.markAllAsRead(req.user.id);

    res.status(200).json({
      data: {
        updated: count,
      },
    });
  };
}
