import { type ReactNode, createContext, useContext, useMemo, useState } from "react";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "python_ai_learning_user";

interface MockUser extends AuthUser {
  password: string;
}

const mockUsers: MockUser[] = [
  {
    id: "student-001",
    fullName: "Nguyễn Văn A",
    email: "student@test.com",
    password: "123456",
    role: "student",
    avatarUrl: "",
  },
  {
    id: "admin-001",
    fullName: "Quản trị viên",
    email: "admin@test.com",
    password: "123456",
    role: "admin",
    avatarUrl: "",
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored) as AuthUser;
      if (parsed.role === "student" || parsed.role === "admin") {
        return parsed;
      }

      localStorage.removeItem(STORAGE_KEY);
      return null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    return new Promise<AuthUser>((resolve, reject) => {
      const normalizedEmail = email.trim().toLowerCase();
      const foundUser = mockUsers.find(
        (item) => item.email === normalizedEmail && item.password === password,
      );

      if (!foundUser) {
        reject(new Error("Email hoặc mật khẩu không đúng."));
        return;
      }

      const nextUser: AuthUser = {
        id: foundUser.id,
        fullName: foundUser.fullName,
        email: foundUser.email,
        role: foundUser.role,
        avatarUrl: foundUser.avatarUrl,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      resolve(nextUser);
    });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
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
