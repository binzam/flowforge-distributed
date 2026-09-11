import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import LoadingScreen from "@/components/LoadingScreen";

import StoreFrontLayout from "@/features/store-front/layouts/StoreFrontLayout";
import AdminLayout from "@/features/admin/layouts/AdminLayout";

// Auth pages
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const SignUpPage = lazy(() => import("@/features/auth/pages/SignupPage"));

// Storefront pages
const HomePage = lazy(
  () => import("@/features/store-front/home/pages/HomePage"),
);
const ProductsPage = lazy(
  () => import("@/features/store-front/products/pages/ProductsPage"),
);
const CartPage = lazy(
  () => import("@/features/store-front/cart/pages/CartPage"),
);
const CheckoutPage = lazy(
  () => import("@/features/store-front/checkout/pages/CheckoutPage"),
);
const MyOrdersPage = lazy(
  () => import("@/features/store-front/orders/pages/MyOrdersPage"),
);
const OrderDetailsPage = lazy(
  () => import("@/features/store-front/orders/pages/OrderDetailsPage"),
);

// Admin pages
const AdminDashboard = lazy(
  () => import("@/features/admin/dashboard/pages/AdminDashboard"),
);
const AdminOrdersPage = lazy(
  () => import("@/features/admin/orders/pages/AdminOrdersPage"),
);
const AdminOrderDetailsPage = lazy(
  () => import("@/features/admin/orders/pages/AdminOrderDetailsPage"),
);
const InventoryPage = lazy(
  () => import("@/features/admin/inventory/pages/InventoryPage"),
);
const InventoryDetailPage = lazy(
  () => import("@/features/admin/inventory/pages/InventoryDetailPage"),
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<StoreFrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />

          <Route element={<RoleProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route
              path="inventory/:productId"
              element={<InventoryDetailPage />}
            />
          </Route>
        </Route>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
