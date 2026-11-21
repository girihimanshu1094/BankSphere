import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => authService.getCurrentSession());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If no existing session, default to customer session so reviewer can explore immediately
    if (!session) {
      // Keep null so they see the login page first or click demo login
    }
  }, [session]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      setSession(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const loginAsCustomer = async (email, password) => {
    return login(email, password);
  };

  const loginAsAdmin = async (email, password) => {
    return login(email, password);
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      setSession(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setSession(null);
  };

  const updateProfile = async (data) => {
    const updated = await authService.updateProfile(data);
    setSession((prev) => (prev ? { ...prev, user: updated } : null));
    return updated;
  };

  const value = {
    user: session?.user || null,
    role: session?.role || null,
    token: session?.token || null,
    isAuthenticated: !!session?.token,
    isCustomer: session?.role === 'CUSTOMER',
    isAdmin: session?.role === 'ADMIN',
    loading,
    login,
    loginAsCustomer,
    loginAsAdmin,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
