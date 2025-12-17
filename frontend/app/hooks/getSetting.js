"use client";
import { useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../../lib/apiGet"; // adjust path if needed

// 🔥 Global flag to prevent multiple calls
let settingFetchedOnce = false;

export default function useSettingRow() {
  const [settingData, setSettingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const inFlightRef = useRef(false); // prevent parallel requests

  const fetchSettingRow = useCallback(async () => {
    if (!token) return;
    if (settingFetchedOnce) return; // already fetched
    if (inFlightRef.current) return; // request in progress

    inFlightRef.current = true;
    setLoading(true);

    try {
      const res = await apiGet({
        endpoint: "/setting/settingrow",
        token,
      });

      if (!res?.success) {
        throw new Error(res?.message || "Failed to fetch setting row");
      }

      setSettingData(res.data ?? null);
      settingFetchedOnce = true; // mark as fetched
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [token]);

  return { settingData, loading, refetch: fetchSettingRow };
}
