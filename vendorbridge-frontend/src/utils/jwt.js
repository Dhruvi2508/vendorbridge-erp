import { normalizeRole } from './rbac';

const decodeBase64Url = (value) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('')
  );
};

export const parseJwt = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }

    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
};

export const extractAuthFromToken = (token) => {
  const claims = parseJwt(token);
  if (!claims) {
    return null;
  }

  const role = normalizeRole(claims.role || claims.authorities?.[0]?.authority || claims.authorities?.[0]);

  return {
    role,
    user: {
      id: claims.userId ?? null,
      email: claims.email ?? claims.sub ?? null,
      firstName: claims.firstName ?? null,
      lastName: claims.lastName ?? null,
      displayName: [claims.firstName, claims.lastName].filter(Boolean).join(' '),
    },
    claims,
  };
};
