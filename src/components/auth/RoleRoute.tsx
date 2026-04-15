import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface RoleRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleRoute = ({ allowedRoles, children }: RoleRouteProps) => {
  const auth = useAuth();
  console.log("RoleRoute auth.user?.role?.name:", auth.user?.role?.name);
  console.log("RoleRoute allowedRoles:", allowedRoles);

	if(allowedRoles && auth.user?.role?.name && !allowedRoles.includes(auth.user?.role?.name)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;