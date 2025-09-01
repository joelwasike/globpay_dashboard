import axios from 'axios';

// API base URL configuration (direct to backend, no proxy)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://merchants.globpay.ai';

console.log('API Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  API_BASE_URL: API_BASE_URL,
  fullURL: API_BASE_URL + '/api/v1/transaction/read/balance'
});

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Disable credentials for CORS
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('merchant_token');
  
  // Don't add Authorization header for login endpoint
  if (token && !config.url.includes('/api/users/login')) {
    // Always use Authorization header with Bearer token
    config.headers.Authorization = `Bearer ${token}`;
    
    // Remove query parameter to avoid duplication
    if (config.params && config.params.token) {
      delete config.params.token;
    }
  }
  
  // Log the actual request URL for debugging
  console.log('API Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: config.baseURL + config.url,
    headers: config.headers,
    params: config.params,
    hasToken: !!token,
    isLoginRequest: config.url.includes('/api/users/login'),
    environment: process.env.NODE_ENV
  });
  
  return config;
});

// Add response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
