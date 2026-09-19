import { useEffect } from "react";
import socket from "../lib/socket";
import { useGetCurrentUser } from "@/features/auth/hooks/auth-hook";

export const useNotificationSocket = () => {
  const { data: user } = useGetCurrentUser();

  useEffect(() => {
    if (!user) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("WebSocket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error.message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [user]);
};
