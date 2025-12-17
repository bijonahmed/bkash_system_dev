"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("username");
    const savedRoles = localStorage.getItem("roles");
    const savedPermissions = localStorage.getItem("permissions");

    if (savedToken) {
      setToken(savedToken);
      setUsername(savedUser || null);
      setRoles(savedRoles ? JSON.parse(savedRoles) : []);
      setPermissions(savedPermissions ? JSON.parse(savedPermissions) : []);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, [router]);

  const login = (newToken, user, userRoles = [], userPermissions = []) => {
    localStorage.setItem("token", newToken.trim());
    localStorage.setItem("username", user);
    localStorage.setItem("roles", JSON.stringify(userRoles));
    //localStorage.setItem("permissions", JSON.stringify(userPermissions));

    setToken(newToken);
    setUsername(user);
    setRoles(userRoles);
    setPermissions(userPermissions);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
    localStorage.removeItem("permissions");

    setToken(null);
    setUsername(null);
    setRoles([]);
    setPermissions([]);
    setIsLoggedIn(false);

    router.replace("/login");
  };

  const hasRole = (roleName) => roles.includes(roleName);
  const hasPermission = (permissionName) => permissions.includes(permissionName);

  // Prevent rendering children until loading is done
  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        username,
        token,
        roles,
        permissions,
        login,
        logout,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
