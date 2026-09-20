import type { ReactNode } from "react";
import { useNotificationSocket } from "../hooks/use-notification-socket";

export const NotificationSocketWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  useNotificationSocket();

  return <>{children}</>;
};
