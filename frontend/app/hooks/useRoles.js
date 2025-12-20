"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // adjust path
import { apiGet } from "../../lib/apiGet";

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
        const res = await apiGet(
          `/roles/index?selectedFilter=${selectedFilter}`,
          token
        );

        setRolesData(res?.data ?? []);
      } catch (err) {
        toast.error(err?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    },
    [token] 
  );

  // ✅ Trigger on load and when token changes
  useEffect(() => {
    if (token) {
      fetchRoles();
    }
  }, [token, fetchRoles]);

  return { rolesData, loading, fetchRoles };
}
