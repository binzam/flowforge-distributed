import { createOnboarding } from "@binii/react-onboarder";

// ALL THE TARGETS IN THE ONBOARDING
export type Target =
  | "home"
  | "dashboard-portal"
  | "dashboard-products"
  | "products-table"
  | "products-table-first-row"
  | "product-edit-button"
  | "product-delete-button"
  | "dashboard-orders"
  | "orders-table"
  | "orders-table-filter"
  | "dashboard-payments"
  | "dashboard-inventory"
  | "dashboard-fulfillments"
  | "dashboard-users"
  | "dashboard-notifications";

export const {
  OnboardingProvider: TourProvider,
  useOnboarding,
  defineTour,
  target,
} = createOnboarding<Target>();
