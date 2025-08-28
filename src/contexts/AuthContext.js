import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api, { API_BASE_URL } from '../config/api';

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
  const [selectedInstitution, setSelectedInstitution] = useState('Merchant A');

  // API instance is now imported from centralized config

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('merchant_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          // Token is valid, set user from decoded token
          setUser({
            id: decoded.user?.id || decoded.id,
            name: decoded.user?.name || decoded.name || 'Merchant User',
            email: decoded.user?.email || decoded.email,
            role: decoded.user?.role?.name || 'Merchant',
            merchantID: decoded.merchantID,
            baseCurrency: decoded.baseCurrency || 'USD',
            permissions: decoded.user?.role?.permissions?.split(',') || ['read', 'write']
          });
        } else {
          localStorage.removeItem('merchant_token');
        }
      } catch (error) {
        console.error('Token decode error:', error);
        localStorage.removeItem('merchant_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Starting login process');
      console.log('AuthContext: API base URL:', API_BASE_URL);
      console.log('AuthContext: Making request to /api/users/login');
      
      const response = await api.post('/api/users/login', {
        user: {
          email: email,
          password: password
        }
      });

      console.log('AuthContext: Login response received:', response);
      console.log('AuthContext: Response data:', response.data);

      if (response.data && response.data.token) {
        const token = response.data.token;
        const userData = response.data.user;
        
        console.log('AuthContext: Token received, storing in localStorage');
        localStorage.setItem('merchant_token', token);
        
        const userObject = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role?.name || 'Merchant',
          merchantID: userData.merchantID,
          baseCurrency: userData.baseCurrency?.currencyCode || 'USD',
          permissions: userData.role?.permissions?.split(',') || ['read', 'write'],
          location: userData.location,
          phone: userData.phone
        };
        
        console.log('AuthContext: Setting user state:', userObject);
        setUser(userObject);

        return { success: true };
      } else {
        console.log('AuthContext: No token in response');
        return { success: false, error: 'Invalid response from server - no token received' };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      console.error('AuthContext: Error response:', error.response);
      console.error('AuthContext: Error message:', error.message);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('AuthContext: Error status:', error.response.status);
        console.error('AuthContext: Error data:', error.response.data);
        return { 
          success: false, 
          error: error.response.data?.message || `Server error: ${error.response.status}` 
        };
      } else if (error.request) {
        // The request was made but no response was received
        console.error('AuthContext: No response received');
        return { 
          success: false, 
          error: 'No response from server. Please check your internet connection.' 
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('AuthContext: Request setup error:', error.message);
        return { 
          success: false, 
          error: 'Login failed. Please check your credentials.' 
        };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('merchant_token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    selectedInstitution,
    setSelectedInstitution,
    api // Expose the configured axios instance
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 