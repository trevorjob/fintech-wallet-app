import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../services/api"; // Assuming you have an api service

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
