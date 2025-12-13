"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/wallet/getwalletAgent`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || `HTTP ${res.status}`);
      }

      setWalletAgentData(result?.data ?? []);
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
