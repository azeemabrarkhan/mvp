import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Role } from "../../enums";

type ProtectedRouteType = {
  children?: ReactNode;
  requiredRoles: Role[];
  currentRole: Role | undefined;
};

const ProtectedRoute = ({ children, requiredRoles, currentRole }: ProtectedRouteType) => {
  if (currentRole === undefined) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.includes(currentRole)) {
    return <>{children}</>;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
