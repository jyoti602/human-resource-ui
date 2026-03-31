import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function getStoredUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Error parsing stored user:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('tenant_slug');
    return null;
  }
}

function getStoredToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return localStorage.getItem('token') || '';
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    }

    if (!getStoredToken() && user?.access_token) {
      localStorage.setItem('token', user.access_token);
    }
  }, [user]);

  const login = (userData) => {
    if (userData?.access_token) {
      localStorage.setItem('token', userData.access_token);
    }
    if (userData?.tenant_slug) {
      localStorage.setItem('tenant_slug', userData.tenant_slug);
    }

    const storedUser = userData?.access_token
      ? { ...userData, access_token: userData.access_token }
      : userData;

    setUser(storedUser);
    localStorage.setItem('user', JSON.stringify(storedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tenant_slug');
    localStorage.removeItem('user');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isEmployee = () => {
    return user?.role === 'employee';
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAdmin,
    isEmployee,
    isAuthenticated: !!user && !!getStoredToken(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
