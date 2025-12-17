"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../../lib/apiGet";

let autoFetchedOnce = false;

export default function useDashboard() {
  console.log("calling dashboard....");
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const inFlightRef = useRef(false);

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

      if (!res?.success) throw new Error(res?.message || "Failed");

      // FIX: extract the actual data object
      const data = res.data?.data ?? res.data ?? {};
      setDashboardData(data);

    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (!autoFetchedOnce) {
      fetchDashboard();
      autoFetchedOnce = true;
    }
  }, [token, fetchDashboard]);

  const refetchDashbaord = useCallback(async () => {
    await fetchDashboard();
  }, [fetchDashboard]);

  return { dashboardData, loading, refetchDashbaord };
}
