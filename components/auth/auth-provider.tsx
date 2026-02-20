"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getToken, setToken, clearToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  hasToken: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  const fetchUser = useCallback(async () => {
    const token = getToken();
    setHasToken(token !== null);
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    let shouldClearUser = false;

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        credentials: "include",
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else if (res.status === 401 || res.status === 403) {
        clearToken();
        setHasToken(false);
        shouldClearUser = true;
      } else {
        console.warn("Failed to fetch user, but keeping token:", res.status);
      }
    } catch (error) {
      console.warn("Network error fetching user, keeping token and user state:", error);
    } finally {
      if (shouldClearUser) {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const token = getToken();
    setHasToken(token !== null);

    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? "Login failed");
    }
    const data = await res.json();
    setToken(data.token);
    setHasToken(true);
    setUser(data.user);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password, password_confirmation: password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Registration failed");
      }
      const data = await res.json();
      setToken(data.token);
      setHasToken(true);
      setUser(data.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
      });
    } catch {
    } finally {
      clearToken();
      setHasToken(false);
      setUser(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    hasToken,
    isLoading,
    login,
    register,
    logout,
    refetchUser: fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
