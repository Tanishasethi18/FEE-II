import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "aura_fitness_auth";

/**
 * AuthProvider centralizes authentication state for the app.
 *
 * NOTE: This is currently a mock, frontend-only implementation backed by
 * localStorage so the UI/UX can be fully built and demoed without a live
 * backend. Swap `login` / `register` for real API calls when the backend
 * is ready — the rest of the app only depends on this context's shape
 * (user, isAuthenticated, login, register, logout), so no other file
 * should need to change.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to read stored session", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = (nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Mock login: in a real integration this would call the auth API and
  // store the returned session/token instead of the raw username.
  const login = async ({ username, email }) => {
    const nextUser = {
      username: username?.trim() || email?.split("@")[0] || "Member",
      email: email || "",
    };
    persist(nextUser);
    return nextUser;
  };

  const register = async ({ username, email }) => {
    const nextUser = {
      username: username?.trim() || email?.split("@")[0] || "Member",
      email: email || "",
    };
    persist(nextUser);
    return nextUser;
  };

  const logout = () => {
    persist(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
