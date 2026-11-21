/**
 * Authentication Service
 * Connects directly to Spring Boot REST API for customer and admin authentication.
 */
import api from './api';
import { mockStorage } from '../data/mockStorage';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      const data = response.data;
      // Backend response format:
      // { token, userId, fullName, email, role, message }
      const session = {
        token: data.token,
        role: data.role,
        user: {
          id: data.userId,
          userId: data.userId,
          name: data.fullName,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        },
        message: data.message,
      };

      mockStorage.saveAuth(session);
      return { success: true, data: session };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 401 || err.response?.status === 400
          ? 'Invalid email or password'
          : 'Unable to connect to the authentication server. Please try again.');
      throw new Error(message);
    }
  },

  register: async (userData) => {
    const payload = {
      fullName: userData.fullName.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      phone: userData.phone.trim().replace(/\D/g, ''),
    };

    try {
      const response = await api.post('/auth/register', payload);

      // Auto-login to obtain real JWT token and session
      const loginResult = await authService.login(payload.email, payload.password);
      return {
        ...loginResult,
        registrationMessage: response.data,
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Registration failed. Please verify your information and try again.';
      throw new Error(message);
    }
  },

  logout: () => {
    mockStorage.saveAuth(null);
  },

  getCurrentSession: () => {
    return mockStorage.getAuth();
  },

  updateProfile: async (updatedData) => {
    const session = mockStorage.getAuth();
    if (session && session.user) {
      session.user = { ...session.user, ...updatedData };
      mockStorage.saveAuth(session);
      return session.user;
    }
    return updatedData;
  },
};
