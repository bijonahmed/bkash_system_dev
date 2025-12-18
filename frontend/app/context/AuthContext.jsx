"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") return sessionStorage.getItem("token");
    return null;
  });
  const [username, setUsername] = useState(() => {
    if (typeof window !== "undefined") return sessionStorage.getItem("username");
    return null;
  });
  const [roles, setRoles] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("roles");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [permissions, setPermissions] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("permissions");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = sessionStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        setUsername(sessionStorage.getItem("username") || null);
        const savedRoles = sessionStorage.getItem("roles");
        const savedPermissions = sessionStorage.getItem("permissions");
        setRoles(savedRoles ? JSON.parse(savedRoles) : []);
        setPermissions(savedPermissions ? JSON.parse(savedPermissions) : []);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
    setLoading(false);
  }, []);

  // Login
  const login = (newToken, user, userRoles = [], userPermissions = []) => {
    sessionStorage.setItem("token", newToken);
    sessionStorage.setItem("username", user);
    sessionStorage.setItem("roles", JSON.stringify(userRoles));
    sessionStorage.setItem("permissions", JSON.stringify(userPermissions));

    setToken(newToken);
    setUsername(user);
    setRoles(userRoles);
    setPermissions(userPermissions);
    setIsLoggedIn(true);
  };

  // Logout with alert
  const logout = () => {
    sessionStorage.clear(); // automatically cleared on tab close anyway
    setToken(null);
    setUsername(null);
    setRoles([]);
    setPermissions([]);
    setIsLoggedIn(false);
    //alert("Expire session, please login again.");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        username,
        roles,
        permissions,
        login,
        logout,
        loading,
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
