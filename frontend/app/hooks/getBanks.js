"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../../lib/apiGet";

export default function useBanks() {
  const [bankData, setBankData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const inFlightRef = useRef(false);

  const fetchBanks = useCallback(async () => {
    if (!token) return;
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    setLoading(true);

    try {
      const res = await apiGet({ endpoint: "/setting/getBanks", token });

      if (!res?.success) throw new Error(res?.message || "Failed to fetch banks");

      // Extract the banks array correctly
      const banks = Array.isArray(res.data?.data) ? res.data.data : [];
      setBankData(banks);
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
      setBankData([]);
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  return { bankData, loading, refetch: fetchBanks };
}
