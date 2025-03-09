// src/services/api.js
import axios from "axios";
// Create axios instance with base URL
const API_URL = import.meta.env.VITE_APP_SERVER_URL;
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;

    // Handle token expiration
    if (response && response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Return standardized error message
    return Promise.reject({
      message: response?.data?.message || "Something went wrong",
      status: response?.status,
      data: response?.data,
    });
  }
);

export default api;
