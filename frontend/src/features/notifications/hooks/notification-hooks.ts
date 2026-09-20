import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadNotificationsCount,
} from "../services/notification-services";
import { queryClient } from "@/lib/query-client";
import type {
  GetNotificationsQuery,
  GetNotificationsResponse,
} from "../types/notification-types";

export const useGetNotifications = (query: GetNotificationsQuery = {}) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(query),
  });
};
export const useGetUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ["unread-notifications"],
    queryFn: () => getUnreadNotificationsCount(),
  });
};

export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications =
        queryClient.getQueryData<GetNotificationsResponse>(["notifications"]);

      queryClient.setQueryData<GetNotificationsResponse>(
        ["notifications"],
        (oldData) => {
          if (!oldData) return oldData;

          const targetNotification = oldData.data.find((n) => n.id === id);
          const wasUnread = targetNotification && !targetNotification.readAt;

          return {
            ...oldData,
            unreadCount: wasUnread
              ? Math.max(0, oldData.unreadCount - 1)
              : oldData.unreadCount,
            data: oldData.data.map((n) =>
              n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
            ),
          };
        },
      );

      return { previousNotifications };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationAsRead = () => {
  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    },
  });
};
