import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { useGetCurrentUser } from "../features/auth/hooks/auth-hook";

const PublicRoute = () => {
  const { data: user, isLoading } = useGetCurrentUser();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (user != null) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
