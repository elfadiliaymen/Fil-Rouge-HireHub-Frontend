import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "./token";
import AccessDenied from "./AccessDenied";

function RoleGuard({ allowedRoles, children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(getRole())) {
    return <AccessDenied />;
  }

  return children;
}

export default RoleGuard;