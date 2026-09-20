import { useGetCurrentUser } from "@/features/auth/hooks/auth-hook";
import type { Notification } from "@/features/notifications/types/notification-types";
import { useEffect } from "react";
import socket from "@/lib/socket";
import { toast } from "react-toastify";
import { queryClient } from "@/lib/query-client";

export const useNotificationSocket = () => {
  const { data: user } = useGetCurrentUser();

  useEffect(() => {
    if (!user?.data.user.id) {
      return;
    }
    const handleConnect = () => {
      console.log("WebSocket connected:", socket.id);
    };

    const handleConnectError = (error: Error) => {
      console.error("WebSocket connection error:", error.message);
    };
    const handleNotification = (notification: Notification) => {
      toast.info(notification.message || "You have a new notification");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("notification", handleNotification);

    socket.connect();
    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("notification", handleNotification);
      socket.disconnect();
    };
  }, [user?.data.user.id]);
};
