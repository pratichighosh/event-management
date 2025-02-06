// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // Change the base URL if your server is running elsewhere
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // Optionally, you could redirect the user to login page here
    }
    return Promise.reject(error);
  }
);

export default api;
