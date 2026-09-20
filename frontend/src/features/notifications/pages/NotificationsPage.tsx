import { CheckCheck, Bell } from "lucide-react";
import NotificationCard from "../components/NotificationCard";
import {
  useGetNotifications,
  useMarkAllNotificationAsRead,
} from "../hooks/notification-hooks";
import { useGetCurrentUser } from "@/features/auth/hooks/auth-hook";
import PageHeaderWrapper from "@/features/back-office/layouts/PageHeaderWrapper";

const NotificationSkeleton = () => (
  <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm animate-pulse">
    <div className="size-12 shrink-0 rounded-full bg-slate-200" />
    <div className="flex-1 space-y-3 py-1">
      <div className="h-4 w-1/3 rounded bg-slate-200" />
      <div className="h-3 w-3/4 rounded bg-slate-200" />
    </div>
    <div className="h-4 w-12 rounded bg-slate-200 self-center" />
  </div>
);

const NotificationsPage = () => {
  const { data: user } = useGetCurrentUser();
  const { data, isLoading } = useGetNotifications();
  const { mutate: markAllRead, isPending } = useMarkAllNotificationAsRead();

  const userRole = user?.data?.user?.role;
  const unreadCount = data?.unreadCount || 0;

  return (
    <section className="w-full">
      {userRole === "customer" ? (
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 md:px-6 lg:px-8 py-2">
          <div>
            <p className="text-sm font-medium text-slate-100">Manage</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-300">
              Notifications
            </h1>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              disabled={isPending}
              className="cursor-pointer flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 disabled:opacity-50"
            >
              <CheckCheck className="size-4" />
              {isPending ? "Updating..." : "Mark all as read"}
            </button>
          )}
        </div>
      ) : (
        <PageHeaderWrapper className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Manage</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Notifications
            </h1>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              disabled={isPending}
              className="cursor-pointer flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 disabled:opacity-50"
            >
              <CheckCheck className="size-4" />
              {isPending ? "Updating..." : "Mark all as read"}
            </button>
          )}
        </PageHeaderWrapper>
      )}

      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <NotificationSkeleton key={i} />
            ))
          ) : data?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Bell className="size-7" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                No notifications yet
              </h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                When you get updates about your orders, payments, or
                fulfillments, they will show up here.
              </p>
            </div>
          ) : (
            data?.data?.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                userRole={userRole}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default NotificationsPage;
