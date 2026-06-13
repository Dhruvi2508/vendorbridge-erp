import api from './axios';

const mapUserRoleToBackend = (role) => {
  const normalized = (role || '').toUpperCase();

  if (normalized === 'VENDOR') {
    return 'VENDOR_MANAGER';
  }

  if (normalized === 'MANAGER') {
    return 'APPROVER';
  }

  return normalized;
};

const normalizeUser = (user) => {
  if (!user) return user;
  return {
    ...user,
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    department: user.department || '',
    role: user.role || '',
    // Normalize status display: ACTIVE -> Active, INACTIVE -> Inactive
    status: user.status
      ? user.status.charAt(0).toUpperCase() + user.status.slice(1).toLowerCase()
      : 'Active',
  };
};

export const getUsers = async () => {
  try {
    const res = await api.get('/api/users');
    return Array.isArray(res.data) ? res.data.map(normalizeUser) : [];
  } catch (err) {
    // Fall back to mock data on any error (network error OR HTTP error like 403/500)
    console.warn('[userApi] getUsers failed, using mock data:', err.message);
    return MOCK_USERS.map(normalizeUser);
  }
};

export const getUserById = async (id) => {
  try {
    const res = await api.get(`/api/users/${id}`);
    return normalizeUser(res.data);
  } catch (err) {
    console.warn('[userApi] getUserById failed, using mock data:', err.message);
    return MOCK_USERS.find(u => u.id === parseInt(id)) || MOCK_USERS[0];
  }
};

export const createUser = async (userData) => {
  try {
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      roleType: mapUserRoleToBackend(userData.role),
    };

    const res = await api.post('/api/auth/register', payload);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const newUser = {
        id: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
      MOCK_USERS.push(newUser);
      return newUser;
    }
    throw new Error(err.response?.data?.message || 'Failed to create user.');
  }
};

export const updateUser = async (id, userData) => {
  try {
    const res = await api.put(`/api/users/${id}`, userData);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const idx = MOCK_USERS.findIndex(u => u.id === parseInt(id));
      if (idx !== -1) {
        MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...userData };
        return MOCK_USERS[idx];
      }
      return { id, ...userData };
    }
    throw new Error(err.response?.data?.message || 'Failed to update user.');
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
  } catch (err) {
    if (!err.response) {
      const idx = MOCK_USERS.findIndex(u => u.id === parseInt(id));
      if (idx !== -1) MOCK_USERS.splice(idx, 1);
      return { success: true };
    }
    throw new Error(err.response?.data?.message || 'Failed to delete user.');
  }
};

const MOCK_USERS = [
  { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@vendorbridge.com', role: 'ADMIN', status: 'ACTIVE', phone: '+1 555-0100', createdAt: '2024-01-10T08:00:00Z' },
  { id: 2, firstName: 'Alex', lastName: 'Thompson', email: 'officer@vendorbridge.com', role: 'PROCUREMENT_OFFICER', status: 'ACTIVE', phone: '+1 555-0200', createdAt: '2024-02-15T09:30:00Z' },
  { id: 3, firstName: 'Supplier', lastName: 'Direct', email: 'vendor@vendorbridge.com', role: 'VENDOR_MANAGER', status: 'ACTIVE', phone: '+1 555-0300', createdAt: '2024-03-01T10:45:00Z' },
  { id: 4, firstName: 'Sarah', lastName: 'Jenkins', email: 'manager@vendorbridge.com', role: 'APPROVER', status: 'ACTIVE', phone: '+1 555-0400', createdAt: '2024-03-20T14:15:00Z' },
  { id: 5, firstName: 'Michael', lastName: 'Chang', email: 'mchang@vendorbridge.com', role: 'PROCUREMENT_OFFICER', status: 'INACTIVE', phone: '+1 555-0500', createdAt: '2024-04-05T11:00:00Z' },
];
