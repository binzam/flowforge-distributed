import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { getHomeRouteForRole } from "@/features/auth/utils/role-routes";
import { Navigate, Outlet } from "react-router-dom";

const RoleProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getHomeRouteForRole(user.role)} replace />;
  }
  return <Outlet />;
};
export default RoleProtectedRoute;
