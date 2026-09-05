import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetCurrentUser } from "../features/auth/hooks/auth-hook";
import LoadingScreen from "../components/LoadingScreen";

const ProtectedRoute = () => {
  const { data: user, isLoading, isError } = useGetCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || user == null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // const isAuthorized = hasAccess(location.pathname, user);

  // if (!isAuthorized) {
  //   return <Navigate to="/" replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;
