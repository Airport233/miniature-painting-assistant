import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: { id: number; nickname: string; email: string } | null;
  login: (token: string, user: { id: number; nickname: string; email: string }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const storedToken = localStorage.getItem('token');
const storedUser = (() => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

export const useAuthStore = create<AuthState>((set, get) => ({
  token: storedToken,
  user: storedUser,
  login: (token: string, user: { id: number; nickname: string; email: string }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
  isAuthenticated: () => {
    return get().token !== null;
  },
}));
