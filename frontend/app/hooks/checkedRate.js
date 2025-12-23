"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../../lib/apiGet";

let settingFetchedOnce = false;

export default function useCheckedRate() {
  const [checkedRate, setCheckedRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const inFlightRef = useRef(false);

  const fetchSettingRow = useCallback(async () => {
    if (!token || settingFetchedOnce || inFlightRef.current) return;

    inFlightRef.current = true;
    setLoading(true);

    try {
      const res = await apiGet({
        endpoint: "/setting/checkedRate",
        token,
      });

      if (!res?.success) throw new Error(res?.message || "Failed to fetch setting row");

      setCheckedRate(res.data ?? null);
      settingFetchedOnce = true;
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [token]);

  // Optional: auto-fetch on mount
  useEffect(() => {
    fetchSettingRow();
  }, [fetchSettingRow]);

  return { checkedRate, fetchSettingRow, loading };
}
