import api from './axios';

const normalizeRole = (role) => {
  const normalized = (role || '').toUpperCase();
  return normalized;
};

const toAuthState = (authResponse) => {
  const role = normalizeRole(authResponse?.role);
  return {
    token: authResponse?.accessToken,
    refreshToken: authResponse?.refreshToken,
    role,
    user: {
      id: authResponse?.userId,
      firstName: authResponse?.firstName,
      lastName: authResponse?.lastName,
      email: authResponse?.email,
      role,
      displayName: [authResponse?.firstName, authResponse?.lastName].filter(Boolean).join(' '),
    },
    message: authResponse?.message,
  };
};

const mapRegisterRoleToBackend = (role) => {
  const normalized = (role || '').toUpperCase();
  if (normalized === 'VENDOR' || normalized === 'VENDOR_MANAGER') {
    return 'VENDOR_MANAGER';
  }
  if (normalized === 'MANAGER' || normalized === 'MANAGER/APPROVER' || normalized === 'APPROVER') {
    return 'APPROVER';
  }
  return normalized;
};

export const login = async (email, password) => {
  try {
    const res = await api.post('/api/auth/login', { email, password });
    return toAuthState(res.data);
  } catch (err) {
    const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
    throw new Error(message);
  }
};

export const register = async (userData) => {
  try {
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      roleType: mapRegisterRoleToBackend(userData.role),
    };

    const res = await api.post('/api/auth/register', payload);
    return res.data;
  } catch (err) {
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
