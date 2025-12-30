"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../../lib/apiGet";

export default function useDashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  const inFlightRef = useRef(false);
  const intervalRef = useRef(null);

  const fetchDashboard = useCallback(async () => {
    if (!token) return;
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    setLoading(true);

    try {
      const res = await apiGet({
        endpoint: "/dashbaord/getDashboardData",
        token,
      });

      if (!res?.success) {
        throw new Error(res?.message || "Dashboard fetch failed");
      }
      const data = res.data?.data ?? res.data ?? {};
      setDashboardData(data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchDashboard();
    intervalRef.current = setInterval(fetchDashboard, 40000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [token, fetchDashboard]);

  const refetchDashboard = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboardData,
    loading,
    refetchDashboard,
  };
}
