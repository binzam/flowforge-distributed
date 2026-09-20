export type NotificationType =
  | "payment.completed"
  | "payment.failed"
  | "inventory.reserved"
  | "fulfillment.shipped"
  | "fulfillment.delivered"
  | "order.cancelled";

export interface NotificationDataMap {
  "payment.completed": {
    orderId: string;
    paymentId: string;
  };

  "payment.failed": {
    orderId: string;
    paymentId: string;
  };

  "inventory.reserved": {
    orderId: string;
  };

  "fulfillment.shipped": {
    orderId: string;
    fulfillmentId: string;
  };

  "fulfillment.delivered": {
    orderId: string;
    fulfillmentId: string;
  };

  "order.cancelled": {
    orderId: string;
  };
}

interface BaseNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export type Notification = {
  [T in NotificationType]: BaseNotification & {
    type: T;
    data: NotificationDataMap[T];
  };
}[NotificationType];

export interface GetNotificationsQuery {
  limit?: number;
  offset?: number;
}
export interface GetNotificationsResponse {
  data: Notification[];
  total: number;
  unreadCount: number;
  limit: null | null;
  offset: null | null;
}
export interface GetUnreadNotificationsCountResponse {
  data: {
    unreadCount: number;
  };
}
