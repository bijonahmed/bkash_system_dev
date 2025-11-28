"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function useSettingRow() {
  const [settingData, setSettingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchSettingRow = useCallback(async () => {
    if (!token) return; // prevent calling API without auth token

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/setting/settingrow`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.message || `HTTP Error: ${res.status}`);
      }

      console.log(
        "fetch result:",
        result?.data?.exchange_rate_wallet ?? null
      );

      setSettingData(result?.data ?? null);
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }, [token]); // FIXED: add token dependency

  useEffect(() => {
    fetchSettingRow();
  }, [fetchSettingRow]); // FIXED: add callback to dependencies

  return { settingData, loading, refetch: fetchSettingRow };
}
