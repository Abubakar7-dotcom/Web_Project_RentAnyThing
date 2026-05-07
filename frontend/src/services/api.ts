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

// Response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not on the auth page already
      if (!window.location.pathname.startsWith('/auth') && 
          !window.location.pathname.startsWith('/forgot-password') &&
          !window.location.pathname.startsWith('/reset-password')) {
        // Clear any local auth state and redirect to login
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
