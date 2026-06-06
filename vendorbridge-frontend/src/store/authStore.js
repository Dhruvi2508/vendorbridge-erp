import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      setAuth: (user, token, role) => {
        if (token) {
          localStorage.setItem('vendorbridge_token', token);
        } else {
          localStorage.removeItem('vendorbridge_token');
        }
        set({ user, token, role });
      },
      logout: () => {
        localStorage.removeItem('vendorbridge_token');
        set({ user: null, token: null, role: null });
      },
    }),
    {
      name: 'vendorbridge-auth',
      getStorage: () => localStorage,
    }
  )
);
