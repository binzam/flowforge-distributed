import {
  Box,
  BriefcaseBusiness,
  CreditCard,
  LayoutDashboard,
  Package,
  ShieldCheck,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    path: "products",
    icon: Package,
  },
  {
    label: "Orders",
    path: "orders",
    icon: BriefcaseBusiness,
  },
  {
    label: "Payments",
    path: "payments",
    icon: CreditCard,
  },
  {
    label: "Inventory",
    path: "inventory",
    icon: Box,
  },
  {
    label: "Fulfillments",
    path: "fulfillments",
    icon: CreditCard,
  },
  {
    label: "Users",
    path: "users",
    icon: Users,
  },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 hidden md:flex flex-col bg-white border-r border-slate-200 shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-slate-900" />
          <span className="font-bold text-lg tracking-tight">
            FlowForge Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {menuItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/admin"}
            className={({ isActive }) =>
              [
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-600"}`}
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

export default AdminSidebar;
