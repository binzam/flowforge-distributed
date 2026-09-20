import { useLocation } from "react-router-dom";
import { useLogoutUser } from "../../auth/hooks/auth-hook";
import NotificationBell from "@/features/notifications/components/NotificationBell";

const uuidRegex =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BackOfficeHeader = () => {
  const { mutate: logoutUser, isPending: isLoggingOut } = useLogoutUser();
  const location = useLocation();
  const isDetailsPage = uuidRegex.test(location.pathname);
  return (
    <header
      className={`shrink-0 bg-white border-b border-yellow-700 flex items-center justify-between px-4 md:px-8 transition-all duration-300 ease-in-out ${
        isDetailsPage ? "h-16" : "h-[7rem]"
      }`}
    >
      {/* Left side (e.g., Mobile Menu Button or Breadcrumbs) */}
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md">
          {/* Hamburger Icon Placeholder */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-sm font-medium text-slate-500 hidden sm:block">
          Dashboard / Overview
        </h1>
      </div>

      {/* Right side (e.g., Profile, Notifications) */}
      <div className="flex items-center gap-4">
        <NotificationBell />
        <button
          onClick={() => logoutUser()}
          className="px-4 py-2 bg-gray-50 text-black border-black border text-sm transition-colors"
        >
          {isLoggingOut ? "Good Bye" : "LOGOUT"}
        </button>
      </div>
    </header>
  );
};

export default BackOfficeHeader;
