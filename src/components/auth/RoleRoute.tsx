import { useAuth } from "@/hooks/useAuth";
import { Navigate, replace } from "react-router-dom";

interface RoleRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleRoute = ({ allowedRoles, children }: RoleRouteProps) => {
  const auth = useAuth();

	if(allowedRoles && auth.user?.role?.name && !allowedRoles.includes(auth.user?.role?.name)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;