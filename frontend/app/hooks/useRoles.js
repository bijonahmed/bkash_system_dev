"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // adjust path

export default function useRoles() {
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // ✅ Add token in dependency (required)
  const fetchRoles = useCallback(
    async (selectedFilter = 1) => {
      if (!token) return; // prevent fetch without token

      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE}/roles/index?selectedFilter=${selectedFilter}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        let result = null;
        try {
          result = await res.json();
        } catch (e) {
          result = null;
        }

        if (!res.ok) {
          throw new Error(result?.message || `HTTP Error: ${res.status}`);
        }

        setRolesData(result?.data || []);
      } catch (err) {
        toast.error(err.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    },
    [token] // ← REQUIRED FIX
  );

  // ✅ Trigger on load and when token changes
  useEffect(() => {
    if (token) {
      fetchRoles();
    }
  }, [token, fetchRoles]); // ← REQUIRED FIX

  return { rolesData, loading, fetchRoles };
}
