function RoleGuard({ children }) {
  // Security disabled for now (no auth backend yet).
  // Re-enable when authentication exists.
  return children;
}

export default RoleGuard;