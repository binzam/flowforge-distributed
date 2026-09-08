import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import PublicRoute from "./PublicRoute";
import LoadingScreen from "@/components/LoadingScreen";
import SignUpPage from "@/features/auth/pages/SignupPage";
import {
  HomePage,
  ProductsPage,
  CartPage,
  CheckoutPage,
  StoreFrontLayout,
} from "@/features/store-front";
import MyOrdersPage from "@/features/store-front/orders/pages/MyOrdersPage";
import OrderDetailsPage from "@/features/store-front/orders/pages/OrderDetailsPage";
import RoleProtectedRoute from "./RoleProtectedRoute";

const AdminLayout = lazy(() =>
  import("@/features/admin").then((mod) => ({ default: mod.AdminLayout })),
);
const AdminDashboard = lazy(() =>
  import("@/features/admin").then((mod) => ({ default: mod.AdminDashboard })),
);
const AdminOrdersPage = lazy(() =>
  import("@/features/admin").then((mod) => ({ default: mod.AdminOrdersPage })),
);
const AdminOrderDetailsPage = lazy(
  () => import("@/features/admin/orders/pages/AdminOrderDetailsPage"),
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
          </Route>

          <Route element={<RoleProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
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
