"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../../lib/apiGet";

export default function useGetAssignWallet() {
  const [walletAgentData, setWalletAgentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchWalletAgent = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await apiGet({ endpoint: "/wallet/getwalletAgent", token });

      // Ensure correct path from API response
      setWalletAgentData(res?.data?.data ?? []);
    } catch (err) {
      toast.error(err?.message || "Failed to load wallet agents");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Auto fetch on mount / token change
  useEffect(() => {
    fetchWalletAgent();
  }, [fetchWalletAgent]);

  return {
    walletAgentData,
    refetchAgentWallet: fetchWalletAgent, // manual refresh
    loading,
  };
}
