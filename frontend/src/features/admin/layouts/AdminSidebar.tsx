import { Link } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin",
  },
  {
    label: "Orders",
    path: "orders",
  },
  {
    label: "Inventory",
    path: "inventory",
  },
  {
    label: "Fulfillments",
    path: "fulfillments",
  },
];
const AdminSidebar = () => {
  return (
    <aside className="w-64 hidden md:flex flex-col bg-white border-r border-slate-200 shrink-0">
      {/* Logo/Brand Area - Fixed height to align with Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <span className="font-bold text-lg tracking-tight">FlowFor Admin</span>
      </div>

      {/* Navigation Area - Scrolls independently if menu gets too long */}
      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {/* Placeholder for navigation links */}
        {menuItems.map((menu) => {
          return (
            <Link
              key={menu.path}
              to={menu.path}
              className="h-10 rounded-md bg-slate-100 flex items-center px-3 text-sm font-medium"
            >
              {menu.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
