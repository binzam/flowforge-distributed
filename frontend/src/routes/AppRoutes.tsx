import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import PublicRoute from "./PublicRoute";
import LoadingScreen from "../components/LoadingScreen";
import HomePage from "../features/store-front/pages/HomePage";
import SignUpPage from "../features/auth/pages/SignupPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminPage from "../features/admin/pages/AdminPage";

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminPage />} />
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
