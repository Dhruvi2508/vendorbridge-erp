import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getDashboardPathForRole, normalizeRole } from '../../utils/rbac';

const RoleGuard = ({ allowedRoles, children }) => {
  const location = useLocation();
  const { isAuthenticated, role, dashboardPath } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedRole = normalizeRole(role);
    const normalizedAllowed = allowedRoles.map((item) => normalizeRole(item));

    if (!normalizedAllowed.includes(normalizedRole)) {
      return (
        <Navigate
          to="/403"
          replace
          state={{
            from: location.pathname,
            fallback: dashboardPath || getDashboardPathForRole(role),
          }}
        />
      );
    }
  }

  return children || <Outlet />;
};

export default RoleGuard;
