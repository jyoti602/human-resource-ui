import React from 'react';
import { useAuth } from '../contexts/AuthContext';

// Admin-only component
export const AdminOnly = ({ children, fallback = null }) => {
  const { isAdmin } = useAuth();
  
  if (isAdmin()) {
    return children;
  }
  
  return fallback;
};

// Employee-only component
export const EmployeeOnly = ({ children, fallback = null }) => {
  const { isEmployee } = useAuth();
  
  if (isEmployee()) {
    return children;
  }
  
  return fallback;
};

// Role-based component that shows different content based on role
export const RoleBased = ({ 
  adminComponent = null, 
  employeeComponent = null, 
  fallback = null 
}) => {
  const { isAdmin, isEmployee } = useAuth();
  
  if (isAdmin()) {
    return adminComponent;
  }
  
  if (isEmployee()) {
    return employeeComponent;
  }
  
  return fallback;
};

// Higher-order component for admin routes
export const withAdminAuth = (Component) => {
  return function AdminAuthenticatedComponent(props) {
    const { isAdmin } = useAuth();
    
    if (!isAdmin()) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

// Higher-order component for employee routes
export const withEmployeeAuth = (Component) => {
  return function EmployeeAuthenticatedComponent(props) {
    const { isEmployee } = useAuth();
    
    if (!isEmployee()) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};
