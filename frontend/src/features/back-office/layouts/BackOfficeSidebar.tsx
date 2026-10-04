import { getMenuItemsForRole } from "@/config/menu-items";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { target } from "@/tour/onboarding";
import { ShieldCheck } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const uuidRegex =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const BackOfficeSidebar = () => {
  const location = useLocation();
  const isDetailsPage = uuidRegex.test(location.pathname);
  const { user } = useAuth();
  const userRole = user?.role;

  const visibleMenuItems = getMenuItemsForRole(userRole);

  return (
    <aside className="w-74 hidden md:flex flex-col bg-white border-r border-yellow-700 shrink-0">
      <div
        className={`flex items-center px-6 sm:px-8 border-b border-yellow-700 transition-all duration-300 ease-in-out ${
          isDetailsPage ? "h-16" : "h-[7rem]"
        }`}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-6 shrink-0 text-slate-900" />
          <span className="font-bold text-lg tracking-tight">
            FlowForge {userRole === "admin" ? "Admin" : "Portal"}
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 flex flex-col gap-4">
        {visibleMenuItems.map(({ label, path, icon: Icon, tourId }) => (
          <NavLink
            key={path}
            {...target(tourId)}
            to={path}
            end={path === "/portal"}
            className={({ isActive }) =>
              [
                "flex h-12 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`size-6 ${isActive ? "text-white" : "text-slate-600"}`}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default BackOfficeSidebar;
