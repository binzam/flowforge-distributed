import { getMenuItemsForRole, type UserRole } from "@/config/menu-items";
import type { Tour, TourStep } from "../tour";
import { isMenuTourId, tourSelector, type TourTargetId } from "./tour-targets";
import type { NavigateFunction } from "react-router-dom";

type StepDef = Omit<TourStep, "target"> & { target: TourTargetId };

interface DashboardTourDeps {
  role: UserRole | undefined;
  navigate: NavigateFunction;
}
export function createDashboardTour({
  role,
  navigate,
}: DashboardTourDeps): Tour {
  const stepDefs: StepDef[] = [
    {
      target: "dashboard-portal",
      title: "Welcome to FlowForge",
      content: "Your home base: a quick look at how the store is doing.",
      placement: "right",
    },
    {
      target: "dashboard-products",
      title: "Products",
      content: "Create, edit, and organize everything you sell.",
      placement: "right",
    },
    {
      target: "dashboard-orders",
      title: "Orders",
      content: "Track every order from placement through delivery.",
      placement: "right",
    },
    {
      target: "orders-table",
      title: "Orders Table",
      content: "All orders are listed here.",
      placement: "top",
      onBeforeShow: () => navigate("/portal/orders"),
      padding: 10,
    },
    {
      target: "dashboard-payments",
      title: "Payments",
      content: "Review payments and reconcile them against orders.",
      placement: "right",
    },
    {
      target: "dashboard-inventory",
      title: "Inventory",
      content: "Keep stock levels accurate so nothing oversells.",
      placement: "right",
    },
    {
      target: "dashboard-fulfillments",
      title: "Fulfillments",
      content: "Follow shipments and see what still needs to go out.",
      placement: "right",
    },
    {
      target: "dashboard-users",
      title: "Users",
      content: "Manage staff accounts and their roles.",
      placement: "right",
    },
    {
      target: "dashboard-notifications",
      title: "Notifications",
      content: "Important events land here as they happen.",
      placement: "right",
    },
  ];

  const visibleMenuIds = new Set<TourTargetId>(
    getMenuItemsForRole(role).map((item) => item.tourId),
  );

  return {
    id: "dashboard-onboarding",
    steps: stepDefs
      .filter(
        ({ target }) => !isMenuTourId(target) || visibleMenuIds.has(target),
      )
      .map(({ target, ...step }) => ({
        ...step,
        target: tourSelector(target),
      })),
  };
}
