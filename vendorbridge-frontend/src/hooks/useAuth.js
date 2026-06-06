import { useAuthStore } from '../store/authStore';
import { extractAuthFromToken } from '../utils/jwt';
import { getDashboardPathForRole, normalizeRole } from '../utils/rbac';

export const useAuth = () => {
  const { user, token, role, setAuth, logout } = useAuthStore();
  const tokenAuth = token ? extractAuthFromToken(token) : null;
  const resolvedRole = normalizeRole(role || tokenAuth?.role);
  const resolvedUser = user || tokenAuth?.user || null;
  const isAuthenticated = !!token;
  const dashboardPath = getDashboardPathForRole(resolvedRole);
  const displayName = resolvedUser
    ? [resolvedUser.firstName, resolvedUser.lastName].filter(Boolean).join(' ') || resolvedUser.email || 'User'
    : 'Guest';

  return {
    user: resolvedUser,
    token,
    role: resolvedRole,
    isAuthenticated,
    setAuth,
    logout,
    dashboardPath,
    displayName,
  };
};
