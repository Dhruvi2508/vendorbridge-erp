import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, token, role, setAuth, logout } = useAuthStore();
  const isAuthenticated = !!token;

  return {
    user,
    token,
    role,
    isAuthenticated,
    setAuth,
    logout,
  };
};
