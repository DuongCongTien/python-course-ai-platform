import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "python_ai_learning_user";

const MOCK_USER = {
  id: "student-001",
  fullName: "Nguyễn Văn A",
  email: "student@test.com",
  password: "123456",
  role: "student",
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }
  }, []);

  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail === MOCK_USER.email && password === MOCK_USER.password) {
        const nextUser: User = {
          id: MOCK_USER.id,
          fullName: MOCK_USER.fullName,
          email: MOCK_USER.email,
          role: MOCK_USER.role,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
        resolve();
      } else {
        reject(new Error("Email hoặc mật khẩu không đúng."));
      }
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
