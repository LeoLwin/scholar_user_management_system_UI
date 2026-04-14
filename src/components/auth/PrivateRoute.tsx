import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

type PrivateRouteProps = {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
    const auth = useAuth() as { user?: { role?: { name: string } } };
    if (!localStorage.getItem('user')) return <Navigate to="/signin" replace />

    if (allowedRoles && auth.user?.role?.name && !allowedRoles.includes(auth.user?.role?.name)) return <Navigate to="/unauthorized" replace />

    return <>{children}</>
};

export default PrivateRoute;