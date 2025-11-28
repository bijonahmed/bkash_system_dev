"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext"; // adjust path

export default function useDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchDashboard = useCallback(async () => {
    if (!token) return; // do nothing if token is not ready
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/dashbaord/getDashboardData`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.message || `HTTP Error: ${res.status}`);
      }

      setDashboardData(result?.data || []);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboardData, loading, refetch: fetchDashboard };
}
