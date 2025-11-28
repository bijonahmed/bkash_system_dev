"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function useFees() {
  const [feesData, setFeesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchFees = useCallback(async () => {
    if (!token) return; // prevent API call until token is ready

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/setting/getFees`;
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

      setFeesData(result?.data || []);
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }, [token]); // FIXED dependency

  useEffect(() => {
    fetchFees();
  }, [fetchFees]); // FIXED dependency

  return { feesData, loading, refetch: fetchFees };
}
