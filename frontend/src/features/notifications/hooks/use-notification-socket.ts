import { useAuth } from "@/features/auth/hooks/use-auth";
import type { Notification } from "@/features/notifications/types/notification-types";
import { queryClient } from "@/lib/query-client";
import socket from "@/lib/socket";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const useNotificationSocket = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
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
  }, [user]);
};
