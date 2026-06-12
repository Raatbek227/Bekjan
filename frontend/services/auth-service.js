import { api } from "@/services/api";

export const authService = {
  async register(payload) {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },

  async login(payload) {
    const { data } = await api.post("/auth/login", payload);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("accessToken", data.accessToken);
    }
    return data;
  },

  async refresh(refreshToken) {
    const { data } = await api.post("/auth/refresh", refreshToken ? { refreshToken } : {});
    if (typeof window !== "undefined") {
      window.localStorage.setItem("accessToken", data.accessToken);
    }
    return data;
  },

  async logout(refreshToken) {
    await api.post("/auth/logout", refreshToken ? { refreshToken } : {});
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("accessToken");
    }
  },

  async forgotPassword(email) {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },

  async resetPassword(payload) {
    const { data } = await api.post("/auth/reset-password", payload);
    return data;
  },

  async verifyEmail(token) {
    const { data } = await api.post("/auth/verify-email", { token });
    return data;
  }
};
