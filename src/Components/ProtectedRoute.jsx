function ProtectedRoute({ children }) {
  // Security disabled for now (no auth backend yet).
  // Re-enable when authentication exists:
  // const token = localStorage.getItem("token");
  // if (!token) return <Navigate to="/login" />;
  return children;
}

export default ProtectedRoute;