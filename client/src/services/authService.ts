// src/services/authService.js
import api from "./api";

export const authService = {
  // Register new user
  register: async (userData: object) => {
    return api.post("/auth/register", userData);
  },

  // Login user
  login: async (credentials: object) => {
    return api.post("/auth/login", credentials);
  },
  forgotPassword: async (credentials: object) => {
    return api.post("/auth/forgot-password", credentials);
  },
  resetPassword: async (credentials: object) => {
    return api.post("/auth/reset-password", credentials);
  },

  // Get user profile
  getProfile: async () => {
    return api.get("/auth/profile");
  },
  getUser: async (walletId: string) => {
    return api.get(`/auth/user/${walletId}`);
  },
};
