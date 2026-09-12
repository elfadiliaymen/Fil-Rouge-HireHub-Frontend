import { Navigate } from "react-router-dom";

function RoleGuard({ children, allowedRoles }) {
  const userData = localStorage.getItem("user");

  if (!userData) {
    return <Navigate to={"/login"} />;
  }

  const user = JSON.parse(userData);

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={"/dashboard"} />;
  }

  return children;
}

export default RoleGuard;