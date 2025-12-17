"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../../lib/apiGet";

// Keep track of auto-fetch only
let autoFetchedOnce = false;

export default function useWallets() {
  const [walletData, setWalletData] = useState([]);
  const [allWalletData, setAllWalletData] = useState([]);
  const [bankrate, setBankRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const inFlightRef = useRef(false); // Prevent parallel calls

  const fetchWallet = useCallback(async () => {
    if (!token) return;
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    setLoading(true);

    try {
      const res = await apiGet({
        endpoint: "/setting/getwallet",
        token,
      });

      if (!res.success) throw new Error(res.error || "Failed to fetch wallet data");

      setWalletData(res.data?.data || []);
      setAllWalletData(res.data?.allwallet || []);
      setBankRate(res.data?.bankrate || 0);
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [token]);

  // Auto-fetch once on component mount
  useEffect(() => {
    if (!token || autoFetchedOnce) return;

    fetchWallet();
    autoFetchedOnce = true; // mark that auto-fetch happened
  }, [token, fetchWallet]);

  return { walletData, allWalletData, bankrate, loading, refetchWallet: fetchWallet };
}
