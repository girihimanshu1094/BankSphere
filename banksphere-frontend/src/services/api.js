/**
 * Centralized Axios API client for BankSphere.
 * Configured with baseURL and interceptors for JWT token handling.
 * When connecting to your Spring Boot REST API, set VITE_API_BASE_URL in a .env file.
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Bearer token if present
api.interceptors.request.use(
  (config) => {
    try {
      const authData = localStorage.getItem('banksphere_current_auth');
      if (authData) {
        const { token } = JSON.parse(authData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.warn('Could not read auth token for request', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global error & 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized. Logging out.');
      localStorage.removeItem('banksphere_current_auth');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
