import type { useAuth } from "@/features/auth/hooks/use-auth";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Box,
  BriefcaseBusiness,
  CreditCard,
  Home,
  LayoutDashboard,
  Package,
  Truck,
  Users,
} from "lucide-react";

export type UserRole = NonNullable<ReturnType<typeof useAuth>["user"]>["role"];

interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  allowedRoles: readonly UserRole[];
  tourId: string;
}


export const menuItems = [
  {
    label: "Store Front",
    path: "/",
    icon: Home,
    allowedRoles: ["admin", "warehouse"],
    tourId: "home",
  },
  {
    label: "Dashboard",
    path: "/portal",
    icon: LayoutDashboard,
    allowedRoles: ["admin", "warehouse"],
    tourId: "dashboard-portal",
  },
  {
    label: "Products",
    path: "products",
    icon: Package,
    allowedRoles: ["admin", "warehouse"],
    tourId: "dashboard-products",
  },
  {
    label: "Orders",
    path: "orders",
    icon: BriefcaseBusiness,
    allowedRoles: ["admin", "warehouse"],
    tourId: "dashboard-orders",
  },
  {
    label: "Payments",
    path: "payments",
    icon: CreditCard,
    allowedRoles: ["admin"],
    tourId: "dashboard-payments",
  },
  {
    label: "Inventory",
    path: "inventory",
    icon: Box,
    allowedRoles: ["admin", "warehouse"],
    tourId: "dashboard-inventory",
  },
  {
    label: "Fulfillments",
    path: "fulfillments",
    icon: Truck,
    allowedRoles: ["admin", "warehouse"],
    tourId: "dashboard-fulfillments",
  },
  {
    label: "Users",
    path: "users",
    icon: Users,
    allowedRoles: ["admin"],
    tourId: "dashboard-users",
  },
  {
    label: "Notifications",
    path: "notifications",
    icon: Bell,
    allowedRoles: ["admin", "warehouse"],
    tourId: "dashboard-notifications",
  },
] as const satisfies readonly MenuItem[];

export type MenuItemConfig = (typeof menuItems)[number];
export type MenuTourId = MenuItemConfig["tourId"];

export function getMenuItemsForRole(
  role: UserRole | undefined,
): MenuItemConfig[] {
  if (!role) return [];
  return menuItems.filter((item) => {
    // Widening assignment (no cast): the literal tuple -> readonly UserRole[]
    const allowed: readonly UserRole[] = item.allowedRoles;
    return allowed.includes(role);
  });
}
