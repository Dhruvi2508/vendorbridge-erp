import axios from 'axios';

const api = axios.create({
  baseURL: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vendorbridge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle 401 globally → logout & redirect
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const requestUrl = err.config?.url || '';
    const isSessionValidationRequest =
      requestUrl.includes('/api/auth/me') || requestUrl.includes('/api/auth/refresh-token');

    if (err.response?.status === 401 && isSessionValidationRequest) {
      localStorage.removeItem('vendorbridge_token');
      localStorage.removeItem('vendorbridge-auth'); // Zustand storage key
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
