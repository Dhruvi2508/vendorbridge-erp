import api from './axios';

export const login = async (email, password) => {
  try {
    const res = await api.post('/api/auth/login', { email, password });
    return res.data;
  } catch (err) {
    if (!err.response) {
      // Mock Login Fallback
      if (email === 'admin@vendorbridge.com') {
        return {
          token: 'mock-jwt-token-admin',
          user: { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@vendorbridge.com', role: 'ADMIN' },
          role: 'ADMIN'
        };
      } else if (email === 'officer@vendorbridge.com') {
        return {
          token: 'mock-jwt-token-officer',
          user: { id: 2, firstName: 'Alex', lastName: 'Thompson', email: 'officer@vendorbridge.com', role: 'PROCUREMENT_OFFICER' },
          role: 'PROCUREMENT_OFFICER'
        };
      } else if (email === 'vendor@vendorbridge.com') {
        return {
          token: 'mock-jwt-token-vendor',
          user: { id: 3, firstName: 'Supplier', lastName: 'Direct', email: 'vendor@vendorbridge.com', role: 'VENDOR' },
          role: 'VENDOR'
        };
      } else {
        // Default to manager
        return {
          token: 'mock-jwt-token-manager',
          user: { id: 4, firstName: 'Sarah', lastName: 'Jenkins', email: 'manager@vendorbridge.com', role: 'MANAGER' },
          role: 'MANAGER'
        };
      }
    }
    const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
    throw new Error(message);
  }
};

export const register = async (userData) => {
  try {
    const res = await api.post('/api/auth/register', userData);
    return res.data;
  } catch (err) {
    if (!err.response) {
      return { success: true, message: 'Registration simulated successfully.' };
    }
    const message = err.response?.data?.message || 'Registration failed.';
    throw new Error(message);
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await api.post('/api/auth/forgot-password', { email });
    return res.data;
  } catch (err) {
    if (!err.response) {
      return { success: true, message: 'Simulated password reset email.' };
    }
    const message = err.response?.data?.message || 'Password reset request failed.';
    throw new Error(message);
  }
};
