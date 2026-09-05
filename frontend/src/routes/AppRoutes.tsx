import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import PublicRoute from "./PublicRoute";
import LoadingScreen from "../components/LoadingScreen";
import HomePage from "../features/store-front/pages/HomePage";
import SignUpPage from "../features/auth/pages/SignupPage";

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
