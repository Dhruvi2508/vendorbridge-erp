import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  const normalizeRole = (value) => {
    const normalized = (value || '').toUpperCase();
    if (normalized === 'VENDOR_MANAGER') {
      return 'MANAGER';
    }
    return normalized;
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const normalizedRole = normalizeRole(role);
    const normalizedAllowed = allowedRoles.map(r => normalizeRole(r));
    if (!normalizedAllowed.includes(normalizedRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
