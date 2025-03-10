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

  // Get user profile
  getProfile: async () => {
    return api.get("/auth/profile");
  },
};
