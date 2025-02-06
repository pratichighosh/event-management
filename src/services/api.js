import axios from 'axios';

// Determine the base URL based on the environment
const BASE_URL = import.meta.env.VITE_API_URL || 'https://event-management-4.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for handling cookies and CORS
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optional: Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;