import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/api`, // Add /api prefix to all requests
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // Don't redirect to /auth if we're already on the auth page or during login/register
    const isAuthPage = window.location.pathname === '/auth';
    const isAuthRequest = error.config?.url?.includes('/auth/');
    
    if (error.response?.status === 401 && !isAuthPage && !isAuthRequest) {
      console.log('401 error, redirecting to /auth');
      // Clear any local auth state and redirect to login
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;
