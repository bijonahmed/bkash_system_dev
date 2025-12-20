"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../../lib/apiGet";

export default function useGetWalletAgent() {
  const [walletAgentData, setWalletAgentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const abortRef = useRef(null);

  const fetchWalletAgent = useCallback(async () => {
    if (!token) return;

    // Cancel previous request if exists
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const res = await apiGet(
        "/wallet/getwalletAgent",
        token,
        controller.signal
      );

      setWalletAgentData(res?.data ?? []);
    } catch (err) {
      if (err.name !== "AbortError") {
        toast.error(err?.message || "Failed to load wallet agents");
      }
    } finally {
      setLoading(false);
    }
   
  }, [token]);

  // Auto fetch on mount / token change
  useEffect(() => {
    fetchWalletAgent();

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [fetchWalletAgent]);

  return {
    walletAgentData,
    refetchAgentWallet: fetchWalletAgent, // manual refresh
    loading,
  };
}
