// import { createContext, useContext, useEffect, useMemo, useState } from "react";

// const AuthContext = createContext(null);
// const STORAGE_KEY = "aura_fitness_auth";

// /**
//  * AuthProvider centralizes authentication state for the app.
//  *
//  * NOTE: This is currently a mock, frontend-only implementation backed by
//  * localStorage so the UI/UX can be fully built and demoed without a live
//  * backend. Swap `login` / `register` for real API calls when the backend
//  * is ready — the rest of the app only depends on this context's shape
//  * (user, isAuthenticated, login, register, logout), so no other file
//  * should need to change.
//  */
// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem(STORAGE_KEY);
//       if (stored) {
//         setUser(JSON.parse(stored));
//       }
//     } catch (err) {
//       console.error("Failed to read stored session", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const persist = (nextUser) => {
//     setUser(nextUser);
//     if (nextUser) {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
//     } else {
//       localStorage.removeItem(STORAGE_KEY);
//     }
//   };

//   // Mock login: in a real integration this would call the auth API and
//   // store the returned session/token instead of the raw username.
//   const login = async ({ username, email }) => {
//     const nextUser = {
//       username: username?.trim() || email?.split("@")[0] || "Member",
//       email: email || "",
//     };
//     persist(nextUser);
//     return nextUser;
//   };

//   const register = async ({ username, email }) => {
//     const nextUser = {
//       username: username?.trim() || email?.split("@")[0] || "Member",
//       email: email || "",
//     };
//     persist(nextUser);
//     return nextUser;
//   };

//   const logout = () => {
//     persist(null);
//   };

//   const value = useMemo(
//     () => ({
//       user,
//       isAuthenticated: Boolean(user),
//       isLoading,
//       login,
//       register,
//       logout,
//     }),
//     [user, isLoading]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return ctx;
// }

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  hashPassword,
  normalizeEmail,
  validatePassword,
  validateUsername,
} from "../utils/auth";

const AuthContext = createContext(null);

const SESSION_KEY = "aura_fitness_auth"; // who is logged in right now
const USERS_KEY = "aura_fitness_users"; // mock "database" of accounts

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`Failed to read "${key}"`, err);
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write "${key}"`, err);
  }
}

const toSession = (account) => ({
  username: account.username,
  email: account.email,
  createdAt: account.createdAt,
});

/**
 * AuthProvider — mock, frontend-only authentication backed by localStorage.
 *
 * Accounts live in USERS_KEY (password stored as a SHA-256 hash); the active
 * login lives in SESSION_KEY. To connect a real backend later, replace the
 * bodies of the async functions below with API calls — their signatures and
 * the context shape can stay exactly the same, so no page needs to change.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = readJSON(SESSION_KEY, null);
    if (stored) setUser(stored);
    setIsLoading(false);
  }, []);

  const persistSession = (session) => {
    setUser(session);
    if (session) writeJSON(SESSION_KEY, session);
    else localStorage.removeItem(SESSION_KEY);
    return session;
  };

  const findAccount = (email) =>
    readJSON(USERS_KEY, []).find((u) => u.email === normalizeEmail(email));

  const updateAccount = (email, changes) => {
    const key = normalizeEmail(email);
    const users = readJSON(USERS_KEY, []);
    writeJSON(
      USERS_KEY,
      users.map((u) => (u.email === key ? { ...u, ...changes } : u))
    );
  };

  /* ---------------------------- sign up / in / out --------------------------- */

  const register = async ({ username, email, password }) => {
    const nameError = validateUsername(username);
    if (nameError) throw new Error(nameError);

    const key = normalizeEmail(email);
    if (!key) throw new Error("Email is required.");

    const passwordError = validatePassword(password);
    if (passwordError) throw new Error(passwordError);

    if (findAccount(key)) {
      throw new Error(
        "An account with this email already exists. Try logging in instead."
      );
    }

    const account = {
      username: username.trim(),
      email: key,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    writeJSON(USERS_KEY, [...readJSON(USERS_KEY, []), account]);
    return persistSession(toSession(account));
  };

  const login = async ({ email, password }) => {
    const account = findAccount(email);
    if (!account) {
      throw new Error("No account found with that email. Sign up to get started.");
    }
    if (account.passwordHash !== (await hashPassword(password))) {
      throw new Error("Incorrect password. Check your password and try again.");
    }
    return persistSession(toSession(account));
  };

  const logout = () => {
    persistSession(null);
  };

  /* --------------------------------- profile -------------------------------- */

  const updateUsername = async (nextName) => {
    if (!user) throw new Error("You need to be logged in.");
    const nameError = validateUsername(nextName);
    if (nameError) throw new Error(nameError);

    const username = nextName.trim();
    updateAccount(user.email, { username });
    return persistSession({ ...user, username });
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    if (!user) throw new Error("You need to be logged in.");

    const account = findAccount(user.email);
    if (!account) {
      throw new Error(
        "We couldn't find your saved account on this device. Log out and sign up again to set a password."
      );
    }
    if (account.passwordHash !== (await hashPassword(currentPassword))) {
      throw new Error("Your current password is incorrect.");
    }
    const passwordError = validatePassword(newPassword);
    if (passwordError) throw new Error(passwordError);
    if (newPassword === currentPassword) {
      throw new Error("Your new password must be different from the current one.");
    }
    updateAccount(user.email, { passwordHash: await hashPassword(newPassword) });
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      register,
      login,
      logout,
      updateUsername,
      changePassword,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}