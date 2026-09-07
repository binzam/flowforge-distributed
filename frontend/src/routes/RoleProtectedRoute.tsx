import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import { useGetCurrentUser } from "@/features/auth/hooks/auth-hook";

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}
const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const { data: user, isLoading, isError } = useGetCurrentUser();

  if (isLoading) return <LoadingScreen />;

  if (isError || user == null) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.data.user.role)) {
    if (user.data.user.role === "admin")
      return <Navigate to="/admin" replace />;
    if (user.data.user.role === "warehouse")
      return <Navigate to="/warehouse" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
