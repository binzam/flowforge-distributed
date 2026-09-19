export type NotificationType =
  | "payment.completed"
  | "payment.failed"
  | "inventory.reserved"
  | "fulfillment.shipped"
  | "fulfillment.delivered"
  | "order.cancelled";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
  readAt: Date | null;
  createdAt: Date;
}

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
}

export interface GetNotificationsResult {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}
