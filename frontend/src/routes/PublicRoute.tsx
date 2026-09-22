import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { getHomeRouteForRole } from "@/features/auth/utils/role-routes";

const PublicRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (user) return <Navigate to={getHomeRouteForRole(user.role)} replace />;
  return <Outlet />;
};
export default PublicRoute;
