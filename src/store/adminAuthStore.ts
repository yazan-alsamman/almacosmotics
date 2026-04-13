import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin1234';

interface AdminAuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (username, password) => {
        if (username === ADMIN_USER && password === ADMIN_PASS) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'alma-admin-auth',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);
