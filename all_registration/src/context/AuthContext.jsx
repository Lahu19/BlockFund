import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api/users';

  const register = async (formData) => {
    try {
      const response = await axios.post(API_URL, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  };

  const login = async (formData) => {
    try {
      // Check for admin credentials
      if (formData.email === 'admin@gmail.com' && formData.password === '1234567') {
        const adminUser = {
          id: 'admin',
          email: 'admin@gmail.com',
          full_name: 'Admin User',
          role: 'admin'
        };
        setUser(adminUser);
        return {
          success: true,
          user: adminUser,
          isAdmin: true,
          redirectTo: 'http://localhost:3000/'
        };
      }

      // For regular users
      const response = await axios.post(`${API_URL}/login`, formData);
      if (response.data.success) {
        const userData = {
          ...response.data.user,
          role: 'user'
        };
        setUser(userData);
        return {
          success: true,
          user: userData,
          isUser: true,
          redirectTo: 'http://localhost:3001'
        };
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 