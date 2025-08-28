import axios from 'axios';

// API base URL configuration
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '' // Use proxy in development (empty string means relative URLs)
  : 'https://merchants.globpay.ai'; // Direct URL in production

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
  if (token) {
    // In development (proxy), use Authorization header
    // In production (direct), use query parameter to avoid CORS
    if (process.env.NODE_ENV === 'development') {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Use query parameter for production to avoid CORS issues
      if (!config.params) config.params = {};
      config.params.token = token;
      delete config.headers.Authorization;
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
    environment: process.env.NODE_ENV
  });
  
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
