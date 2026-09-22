import { useAuth } from "@/features/auth/hooks/use-auth";
import { Bell, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetUnreadNotificationsCount } from "../hooks/notification-hooks";

const NotificationBell = () => {
  const { user } = useAuth();
  const { data, isLoading, isFetching } = useGetUnreadNotificationsCount();
  const unreadCount = data?.data?.unreadCount || 0;

  if (!user) {
    return null;
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
        <Loader className="size-5 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <Link
      to={"notifications"}
      className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
    >
      <Bell className="size-5 text-slate-700" />
      {unreadCount > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
