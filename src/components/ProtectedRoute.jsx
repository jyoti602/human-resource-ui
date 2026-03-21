import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Protected route component that checks authentication
export const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/login' }) => {
  const { isAuthenticated, isAdmin, isEmployee } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role requirements
  if (requiredRole === 'admin' && !isAdmin()) {
    return <Navigate to="/employee/dashboard" replace />;
  }

  if (requiredRole === 'employee' && !isEmployee()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

// Admin-only route
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="admin">
    {children}
  </ProtectedRoute>
);

// Employee-only route
export const EmployeeRoute = ({ children }) => (
  <ProtectedRoute requiredRole="employee">
    {children}
  </ProtectedRoute>
);
