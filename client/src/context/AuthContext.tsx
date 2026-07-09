"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, name: string, password: string) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("rf_token");
      if (token) {
        const userData = await api.getMe();
        setUser(userData);
        localStorage.setItem("rf_user", JSON.stringify(userData));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Protect dashboard routes
  useEffect(() => {
    if (!loading) {
      const isDashboardRoute = pathname?.startsWith("/dashboard");
      const isAuthRoute = pathname === "/login" || pathname === "/register";
      
      if (isDashboardRoute && !user) {
        router.push("/login");
      } else if (isAuthRoute && user) {
        router.push("/dashboard");
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      localStorage.setItem("rf_token", res.access_token);
      localStorage.setItem("rf_user", JSON.stringify(res.user));
      setUser(res.user);
      router.push("/dashboard");
      return res;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, name: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.register(email, name, password);
      // Auto login after registration
      localStorage.setItem("rf_token", res.access_token);
      localStorage.setItem("rf_user", JSON.stringify(res.user));
      setUser(res.user);
      router.push("/dashboard");
      return res;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
