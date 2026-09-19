import { AppError } from "../../../errors/AppError.js";
import type { NotificationRepository } from "../repositories/NotificationRepository.js";
import type { GetNotificationsQuery } from "../schemas/notification.schemas.js";
import type {
  CreateNotificationInput,
  GetNotificationsResult,
  Notification,
} from "../types/notification.types.js";

export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async create(input: CreateNotificationInput): Promise<Notification> {
    return this.notificationRepository.create(input);
  }
  async getNotifications(
    userId: string,
    options: GetNotificationsQuery,
  ): Promise<GetNotificationsResult> {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;

    const [notifications, total, unreadCount] = await Promise.all([
      this.notificationRepository.findAllByUserId(userId, limit, offset),
      this.notificationRepository.countByUserId(userId),
      this.notificationRepository.countUnread(userId),
    ]);

    return {
      notifications,
      total,
      unreadCount,
    };
  }
  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.markAsRead(
      notificationId,
      userId,
    );

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return notification;
  }

  async markAllAsRead(userId: string): Promise<number> {
    return this.notificationRepository.markAllAsRead(userId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.countUnread(userId);
  }
}
