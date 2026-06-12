import { create } from "zustand";
import { authService } from "@/services/auth-service";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  loading: false,
  error: null,

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const session = await authService.login(payload);
      set({
        user: session.user,
        accessToken: session.accessToken,
        loading: false
      });
      return session;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to sign in";
      set({ error: message, loading: false });
      throw error;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const result = await authService.register(payload);
      set({ user: result.user, loading: false });
      return result;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to create account";
      set({ error: message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, accessToken: null, error: null });
  }
}));
