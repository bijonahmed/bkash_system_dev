"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * 🔐 AUTH CHECK (RUNS ON EVERY PAGE LOAD)
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = sessionStorage.getItem("token");

    // 🔒 Not logged in → block protected routes
    if (!storedToken) {
      // login page ছাড়া অন্য সব page block
      if (pathname !== "/login") {
        router.replace("/login");
      }
      setLoading(false);
      return;
    }

    // ✅ Logged in
    setToken(storedToken);
    setUsername(sessionStorage.getItem("username"));
    setRoles(JSON.parse(sessionStorage.getItem("roles") || "[]"));
    setPermissions(
      JSON.parse(sessionStorage.getItem("permissions") || "[]")
    );

    // 🔁 Login page এ থাকলে dashboard এ পাঠাও
    if (pathname === "/login") {
      router.replace("/dashboard");
    }

    setLoading(false);
  }, [router, pathname]);

  /**
   * ✅ LOGIN (STATE ONLY — storage login page এ set হবে)
   */
  const login = (token, user, roles = [], permissions = []) => {
    setToken(token);
    setUsername(user);
    setRoles(roles);
    setPermissions(permissions);
  };

  /**
   * 🚪 LOGOUT
   */
  const logout = () => {
    sessionStorage.clear();

    setToken(null);
    setUsername(null);
    setRoles([]);
    setPermissions([]);

    router.replace("/login");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        roles,
        permissions,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
