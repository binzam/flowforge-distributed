import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { useGetCurrentUser } from "../features/auth/hooks/auth-hook";

const PublicRoute = () => {
  const { data: user, isLoading } = useGetCurrentUser();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (user != null) {
    const destination = user.data.user.role === "admin" ? "/admin" : "/";
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
