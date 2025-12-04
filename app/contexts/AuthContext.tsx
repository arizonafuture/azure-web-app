"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { LoginRequest, RegisterRequest } from "../types";
import { API_BASE_URL } from "../config/umbraco";
// Optional: Import useAuth if merging
// import { useAuth } from "../hooks/useAuth";

interface AuthContextType {
  isAuthenticated: () => boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  user: any; // Optional: Store user data if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); // Fixed: Added 'undefined'

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null); // Store user data if needed
  const [token, setToken] = useState<string | null>(null);

  // Initialize token from localStorage on client side
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Optional: Use useAuth hook inside context for better API handling
  // const { login: hookLogin, register: hookRegister, logout: hookLogout, user: hookUser, token: hookToken } = useAuth();
  // Then, set state from hook: setUser(hookUser); setToken(hookToken);

  // Check if authenticated (e.g., via token)
  const isAuthenticated = () => !!token;

  // Fixed: Login function - throw error on failure
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/umbraco/api/members/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials), // { email, password }
        }
      );

      if (!response.ok) {
        // Failure: Throw error with message from backend
        const errorData = await response.json().catch(() => ({})); // Fallback if no JSON
        const errorMessage =
          errorData.message || `Login failed (${response.status})`;
        throw new Error(errorMessage);
      }

      // Success: Parse response and store token/user
      const result = await response.json();
      if (result.success && result.token) {
        setToken(result.token);
        localStorage.setItem("token", result.token);
        setUser(result.user || { email: credentials.email }); // Store user if returned
      } else {
        throw new Error("Login succeeded but no token received");
      }
    } catch (error) {
      // Re-throw to trigger catch in onLoginSubmit
      throw error;
    }
  };

  // Register function (similar error handling)
  const register = async (userData: RegisterRequest) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/umbraco/api/members/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData), // { name, email, password }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `Registration failed (${response.status})`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Registration failed");
      }
      // Optional: Auto-login after register or redirect
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    router.push("/"); // Redirect to home after logout
  };

  // Optional: Check token validity on app load
  useEffect(() => {
    if (token) {
      // Validate token with backend if needed (e.g., fetch user profile)
      // If invalid, call logout()
    }
  }, [token]);

  const value: AuthContextType = {
    isAuthenticated,
    login,
    register,
    logout,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
