// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

interface AuthContextType {
  login: (credentials: object) => Promise<void>;
  register: (userData: object) => Promise<void>;
  user: object | null;

  logout: () => void;
  loading: boolean;
  error: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Get user profile from token
          const userData = await authService.getProfile();
          console.log(userData);
          setUser(userData.data.user);
        } catch (err) {
          console.error("Auth error:", err);
          localStorage.removeItem("token");
          setError("Session expired. Please login again.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: object) => {
    console.log(credentials);

    setLoading(true);
    try {
      const data = await authService.login(credentials);
      console.log(data.data);
      localStorage.setItem("token", data.data.token);
      setUser(data.data.user);
      // return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: object) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      localStorage.setItem("token", data.data.token);
      setUser(data.data.user);
      // return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
