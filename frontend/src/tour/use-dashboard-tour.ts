import { useMemo } from "react";
import { defineTour } from "./onboarding";
import { useNavigate } from "react-router-dom";

export function useDashboardTour() {
  const navigate = useNavigate();
  return useMemo(
    () =>
      defineTour("dashboard-onboarding", [
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
          onBeforeShow: () => navigate("/portal/products"),
        },
        {
          target: "products-table",
          title: "Products Table",
          content: "All products are listed here.",
          placement: "top",
          onBeforeShow: () => navigate("/portal/products"),
          padding: 10,
          radius: 0,
        },
        {
          target: "products-table-first-row",
          title: "Manage a Product",
          content:
            "This row represents a single product. Let's look at what you can do with it.",
          placement: "bottom",
          onBeforeShow: () => navigate("/portal/products"),
          padding: 4,
        },
        {
          target: "product-edit-button",
          title: "Edit Product",
          content:
            "Click this to update the product's price, SKU, name, or description.",
          placement: "left",
          onBeforeShow: () => navigate("/portal/products"),
          padding: 4,
          radius: 4,
        },
        {
          target: "product-delete-button",
          title: "Delete Product",
          content:
            "Remove this product from your catalog entirely. (Don't worry, it asks for confirmation first!)",
          placement: "left",
          onBeforeShow: () => navigate("/portal/products"),
          padding: 4,
          radius: 4,
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
          radius: 0,
        },
        {
          target: "orders-table-filter",
          title: "Orders Table Filter",
          content:
            "Filters can be applied to the orders table by searching for a specfic users orderes or by the status of the order.",
          placement: "bottom",
          radius: 4,
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
      ]),
    [navigate],
  );
}
