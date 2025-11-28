"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // adjust path

export default function useBanks() {
  const [bankData, setBankData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchBanks = useCallback(async () => {
    if (!token) return; // prevent API call if token is not ready

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/setting/getBanks`;
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

      setBankData(result?.data || []);
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }, [token]); // FIXED dependency

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]); // FIXED dependency

  return { bankData, loading, refetch: fetchBanks };
}
