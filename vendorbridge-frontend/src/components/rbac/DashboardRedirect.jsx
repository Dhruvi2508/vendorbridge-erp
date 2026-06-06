import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DashboardRedirect = () => {
  const { dashboardPath } = useAuth();

  return <Navigate to={dashboardPath} replace />;
};

export default DashboardRedirect;
