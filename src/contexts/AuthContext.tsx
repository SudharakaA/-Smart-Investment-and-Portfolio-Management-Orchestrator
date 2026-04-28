import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { apiUrl, getApiBaseUrl } from "@/lib/api";

interface AuthUser {
  id: number;
  username: string;
  createdAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = getApiBaseUrl();

  const setSession = (nextToken: string | null, nextUser: AuthUser | null) => {
    setToken(nextToken);
    setUser(nextUser);
    if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken);
    else localStorage.removeItem(TOKEN_KEY);
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(USER_KEY);
  };

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiBaseUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Invalid session");
        const currentUser = (await res.json()) as AuthUser;
        setSession(token, currentUser);
      } catch {
        setSession(null, null);
      } finally {
        setLoading(false);
      }
    };

    void restoreSession();
  }, [apiBaseUrl, token]);

  const authRequest = async (path: string, payload: { username: string; password: string }) => {
    try {
      return await fetch(`${apiBaseUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error(`Cannot reach backend API at ${apiBaseUrl}`);
    }
  };

  const login = async (username: string, password: string) => {
    const res = await authRequest("/api/auth/login", { username, password });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(err.detail ?? "Login failed");
    }
    const data = await res.json();
    setSession(data.token, data.user as AuthUser);
  };

  const register = async (username: string, password: string) => {
    const res = await authRequest("/api/auth/register", { username, password });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Registration failed" }));
      throw new Error(err.detail ?? "Registration failed");
    }
    const data = await res.json();
    setSession(data.token, data.user as AuthUser);
  };

  const logout = async () => {
    if (token) {
      await fetch(apiUrl("/api/auth/logout"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined);
    }
    setSession(null, null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
