// ============================================
// PlayNxt - Auth Store (Zustand)
// ============================================

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginForm, SignupForm } from '@/types';
import { authApi } from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOtpSent: boolean;
  error: string | null;

  // Actions
  login: (form: LoginForm) => Promise<boolean>;
  signup: (form: SignupForm) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isOtpSent: false,
      error: null,

      login: async (form: LoginForm) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.login(form);

          if (response.success && response.data) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
              isOtpSent: false,
            });
            return true;
          } else if (response.success && !response.data) {
            // OTP sent
            set({ isOtpSent: true, isLoading: false });
            return false;
          } else {
            set({ error: response.error || 'Login failed', isLoading: false });
            return false;
          }
        } catch (error) {
          set({ error: 'Something went wrong', isLoading: false });
          return false;
        }
      },

      signup: async (form: SignupForm) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.signup(form);

          if (response.success && response.data) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } else {
            set({ error: response.error || 'Signup failed', isLoading: false });
            return false;
          }
        } catch (error) {
          set({ error: 'Something went wrong', isLoading: false });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await authApi.logout();
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            isOtpSent: false,
            error: null,
          });
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null, isOtpSent: false });
      },

      hydrate: () => {
        // Called on app start to rehydrate state
        const state = get();
        if (state.token && state.user) {
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

