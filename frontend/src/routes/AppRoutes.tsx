import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import LoadingScreen from "@/components/LoadingScreen";

import StoreFrontLayout from "@/features/store-front/layouts/StoreFrontLayout";
import BackOfficeLayout from "@/features/back-office/layouts/BackOfficeLayout";
// Auth pages
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const SignUpPage = lazy(() => import("@/features/auth/pages/SignupPage"));
const GoogleCallbackPage = lazy(
  () => import("@/features/auth/pages/GoogleCallbackPage"),
);

// Storefront pages
const HomePage = lazy(
  () => import("@/features/store-front/home/pages/HomePage"),
);
const StoreFrontProductsPage = lazy(
  () => import("@/features/store-front/products/pages/ProductsPage"),
);
const CartPage = lazy(
  () => import("@/features/store-front/cart/pages/CartPage"),
);
const CheckoutPage = lazy(
  () => import("@/features/store-front/checkout/pages/CheckoutPage"),
);
const CustomerOrdersPage = lazy(
  () => import("@/features/store-front/orders/pages/CustomerOrdersPage"),
);
const CustomerOrderDetailsPage = lazy(
  () => import("@/features/store-front/orders/pages/CustomerOrderDetailsPage"),
);

// Backoffice pages
const DashboardPage = lazy(
  () => import("@/features/back-office/dashboard/pages/DashboardPage"),
);
const BackOfficeProductsPage = lazy(
  () => import("@/features/back-office/products/pages/BackOfficeProductsPage"),
);
const BackOfficeOrdersPage = lazy(
  () => import("@/features/back-office/orders/pages/BackOfficeOrdersPage"),
);
const BackOfficeOrderDetailsPage = lazy(
  () =>
    import("@/features/back-office/orders/pages/BackOfficeOrderDetailsPage"),
);
const PaymentsPage = lazy(
  () => import("@/features/back-office/payments/pages/PaymentsPage"),
);
const InventoryPage = lazy(
  () => import("@/features/back-office/inventory/pages/InventoryPage"),
);
const InventoryDetailPage = lazy(
  () => import("@/features/back-office/inventory/pages/InventoryDetailPage"),
);
const FulfillmentsPage = lazy(
  () => import("@/features/back-office/fulfillments/pages/FulfillmentsPage"),
);
const FulfillmentDetailPage = lazy(
  () =>
    import("@/features/back-office/fulfillments/pages/FulfillmentDetailPage"),
);
const UsersPage = lazy(
  () => import("@/features/back-office/users/pages/UsersPage"),
);
const UserDetailPage = lazy(
  () => import("@/features/back-office/users/pages/UserDetailPage"),
);
// Shared Pages
const NotificationsPage = lazy(
  () => import("@/features/notifications/pages/NotificationsPage"),
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen label="FLOWFORGE" />}>
      <Routes>
        <Route element={<StoreFrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<StoreFrontProductsPage />} />
          <Route path="/about" element={<StoreFrontProductsPage />} />
          <Route path="/studio" element={<StoreFrontProductsPage />} />
          <Route path="/collections" element={<StoreFrontProductsPage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route element={<RoleProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/orders" element={<CustomerOrdersPage />} />
            <Route path="/orders/:id" element={<CustomerOrderDetailsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        <Route
          element={<RoleProtectedRoute allowedRoles={["admin", "warehouse"]} />}
        >
          <Route path="/portal" element={<BackOfficeLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<BackOfficeProductsPage />} />
            <Route path="orders" element={<BackOfficeOrdersPage />} />
            <Route path="orders/:id" element={<BackOfficeOrderDetailsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route
              path="inventory/:productId"
              element={<InventoryDetailPage />}
            />
            <Route path="fulfillments" element={<FulfillmentsPage />} />
            <Route
              path="fulfillments/:id"
              element={<FulfillmentDetailPage />}
            />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/auth/callback" element={<GoogleCallbackPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
