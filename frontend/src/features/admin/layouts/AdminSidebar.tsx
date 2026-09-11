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
    <aside
      className="w-64 hidden md:flex flex-col shrink-0"
      style={{ backgroundColor: "var(--brand-dark-green)" }}
    >
      {/* Logo/Brand Area - Fixed height to align with Header */}
      <div
        className="h-16 flex items-center px-6 border-b"
        style={{ borderColor: "var(--brand-green)" }}
      >
        <span
          className="font-bold text-lg tracking-tight"
          style={{ color: "var(--brand-cream)" }}
        >
          FlowFor Admin
        </span>
      </div>

      {/* Navigation Area - Scrolls independently if menu gets too long */}
      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {/* Placeholder for navigation links */}
        {menuItems.map((menu) => {
          return (
            <Link
              key={menu.path}
              to={menu.path}
              className="h-10 rounded-md flex items-center px-3 text-sm font-medium transition-colors hover:opacity-100"
              style={{
                backgroundColor: "var(--brand-light-green)",
                color: "white",
                opacity: 0.9,
              }}
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
