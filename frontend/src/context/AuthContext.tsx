import { type ReactNode, createContext, useContext, useMemo, useState } from "react";
import { apiFetch } from "../config/api";

export type UserRole = "student" | "admin";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: number | string;
    username?: string;
    fullName?: string | null;
    full_name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
    avatar_url?: string | null;
    role?: UserRole;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "python_ai_learning_user";
const TOKEN_STORAGE_KEY = "python_ai_learning_token";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!stored || !token) return null;

      const parsed = JSON.parse(stored) as AuthUser;
      if (parsed.role === "student" || parsed.role === "admin") {
        return parsed;
      }

      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    const response = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: email.trim(),
        password,
      }),
    });

    const nextUser: AuthUser = {
      id: String(response.user.id),
      fullName: response.user.fullName || response.user.full_name || response.user.username || email.trim(),
      email: response.user.email || email.trim(),
      role: response.user.role === "admin" ? "admin" : "student",
      avatarUrl: response.user.avatarUrl || response.user.avatar_url || "",
    };

    localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
