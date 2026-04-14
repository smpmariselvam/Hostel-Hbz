import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Get API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'https://hostel-hbz.onrender.com';

  // Configure axios defaults
  useEffect(() => {
    // Set base URL for all requests
    axios.defaults.baseURL = API_URL;
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token, API_URL]);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          console.log('Loading user with token...');
          const response = await axios.get('/api/auth/me');
          console.log('User loaded:', response.data.user);
          setUser(response.data.user);
        } catch (error) {
          console.error('Error loading user:', error);
          // Clear invalid token
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('=== CLIENT LOGIN ATTEMPT ===');
      console.log('Email:', email);
      console.log('Password length:', password?.length);
      
      const requestData = { 
        email: email.trim(), 
        password 
      };
      
      console.log('Sending login request to:', axios.defaults.baseURL + '/api/auth/login');
      console.log('Request data:', { ...requestData, password: '[HIDDEN]' });
      
      const response = await axios.post('/api/auth/login', requestData);
      
      console.log('Login response received:', {
        ...response.data,
        token: '[HIDDEN]'
      });
      
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      console.log('Login successful for user:', userData.email);
      return { success: true };
    } catch (error) {
      console.error('=== CLIENT LOGIN ERROR ===');
      console.error('Error object:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      let message = 'Login failed';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      return { 
        success: false, 
        message 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration for:', userData.email);
      
      const response = await axios.post('/api/auth/register', {
        ...userData,
        email: userData.email.trim(),
        name: userData.name.trim(),
        phone: userData.phone.trim()
      });
      
      console.log('Registration response:', response.data);
      
      const { token: newToken, user: newUser } = response.data;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      
      console.log('Registration successful for user:', newUser.email);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      
      let message = 'Registration failed';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      return { 
        success: false, 
        message 
      };
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isApproved = () => {
    return user?.isApproved === true;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    isApproved
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};