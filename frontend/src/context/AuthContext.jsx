import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isBusiness: user?.userType === 'business',
    isNormal: user?.userType === 'normal',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};