import { apiClient } from "@/lib/api-client";
import type {
  GetNotificationsQuery,
  GetNotificationsResponse,
  GetUnreadNotificationsCountResponse
} from "../types/notification-types";

export const getNotifications = async (query: GetNotificationsQuery) => {
  const response = await apiClient.get<GetNotificationsResponse>(
    "/notifications",
    {
      params: query,
    },
  );
  return response.data;
};
export const getUnreadNotificationsCount = async () => {
  const response = await apiClient.get<GetUnreadNotificationsCountResponse>(
    "/notifications/unread-count",
  );
  return response.data;
};

export const markAsRead = async (id: string): Promise<void> => {
  const response = await apiClient.patch(`/notifications/${id}/read`, {});
  return response.data;
};

export const markAllAsRead = async (): Promise<void> => {
  const response = await apiClient.patch("/notifications/read-all", {});
  return response.data;
};
