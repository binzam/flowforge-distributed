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
import RoleProtectedRoute from "./RoleProtectedRoute";
// You can destructure directly from the admin barrel file inside the dynamic import
const AdminLayout = lazy(() =>
  import("@/features/admin").then((mod) => ({ default: mod.AdminLayout })),
);
const AdminDashboard = lazy(() =>
  import("@/features/admin").then((mod) => ({ default: mod.AdminDashboard })),
);
const AdminOrdersPage = lazy(() =>
  import("@/features/admin").then((mod) => ({ default: mod.AdminOrdersPage })),
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<StoreFrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route element={<RoleProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrdersPage />} />
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
