import { Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Box,
  Truck,
  PackageCheck,
  Ban,
  ChevronRight,
} from "lucide-react";
import type { Notification } from "../types/notification-types";
import { dateFormatter } from "@/utils/date-formatter";
import { useMarkNotificationAsRead } from "../hooks/notification-hooks";

const styleMap: Record<
  Notification["type"],
  { icon: React.ElementType; color: string; bg: string }
> = {
  "payment.completed": {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  "payment.failed": { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
  "inventory.reserved": {
    icon: Box,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  "fulfillment.shipped": {
    icon: Truck,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  "fulfillment.delivered": {
    icon: PackageCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  "order.cancelled": { icon: Ban, color: "text-slate-500", bg: "bg-slate-200" },
};

interface NotificationCardProps {
  notification: Notification;
  userRole?: string;
}

const NotificationCard = ({
  notification,
  userRole,
}: NotificationCardProps) => {
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const isUnread = !notification.readAt;

  const getNavigationPath = () => {
    if (userRole === "customer") {
      return `/orders/${notification.data.orderId}`;
    }
    switch (notification.type) {
      case "payment.completed":
      case "payment.failed":
      case "inventory.reserved":
      case "order.cancelled":
        return `/portal/orders/${notification.data.orderId}`;
      case "fulfillment.shipped":
      case "fulfillment.delivered":
        return `/portal/fulfillments/${notification.data.fulfillmentId}`;
    }
  };

  const handleCardClick = () => {
    if (isUnread) {
      markAsRead(notification.id);
    }
  };

  const { icon: Icon, color, bg } = styleMap[notification.type];

  return (
    <Link
      to={getNavigationPath()}
      onClick={handleCardClick}
      className={`group flex items-start gap-4 rounded-2xl border p-4 transition-all duration-200 hover:shadow-md ${
        isUnread
          ? "border-blue-100 bg-blue-50/50 hover:bg-blue-50"
          : "border-slate-100 bg-white hover:border-slate-200"
      }`}
    >
      <div
        className={`mt-1 flex size-12 shrink-0 items-center justify-center rounded-full ${bg}`}
      >
        <Icon className={`size-6 ${color}`} strokeWidth={1.5} />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h3
            className={`text-[15px] font-semibold tracking-tight ${
              isUnread ? "text-slate-900" : "text-slate-700"
            }`}
          >
            {notification.title}
          </h3>
          {isUnread && (
            <span
              className="size-2 rounded-full bg-blue-500 shadow-sm"
              aria-label="Unread"
            />
          )}
        </div>
        <p className="text-sm text-slate-500 line-clamp-2">
          {notification.message}
        </p>
        <div className="text-xs font-medium text-slate-400 pt-1">
          {dateFormatter(notification.createdAt, "relative")}
        </div>
      </div>

      <div className="flex h-full shrink-0 items-center self-center text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-500">
        <ChevronRight className="size-5" />
      </div>
    </Link>
  );
};

export default NotificationCard;
