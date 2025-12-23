import { useState, useEffect, useCallback } from "react";
import { apiGet } from "../../lib/apiGet";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function useRoles(endpoint = "/roles/index") {
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchRoles = useCallback(
    async (selectedFilter = 1) => {
      if (!token) return; // prevent fetch without token
      setLoading(true);

      try {
        const res = await apiGet({
          endpoint: `${endpoint}?selectedFilter=${selectedFilter}`,
          token,
        });

        const roles = res?.data?.data ?? [];
        setRolesData(roles);

      } catch (err) {
        toast.error(err?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    },
    [token, endpoint]
  );

  // fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { rolesData, fetchRoles, loading };
}
