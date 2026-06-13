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

// Handle 401 globally → clear stale token & redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const requestUrl = err.config?.url || '';
    const isAuthRequest = requestUrl.includes('/api/auth/login') || requestUrl.includes('/api/auth/register');

    // If any non-auth request returns 401, the token is expired/invalid — log out
    if (err.response?.status === 401 && !isAuthRequest) {
      console.warn('[axios] 401 received — clearing expired session and redirecting to login');
      localStorage.removeItem('vendorbridge_token');
      localStorage.removeItem('vendorbridge-auth'); // Zustand storage key
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

