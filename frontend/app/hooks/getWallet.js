"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../../lib/apiGet"; // adjust path

export default function useGetWallet() {
  const [walletData, setWalletData] = useState([]);
  const [allWalletData, setAllWalletData] = useState([]);
  const [bankrate, setBankRate] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchWallet = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await apiGet({
        endpoint: "/setting/getwallet",
        token,
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to fetch wallet data");
      }

      //console.log("Bank Data:", res.data?.bankrate);
      setWalletData(res.data?.data || []);
      setBankRate(res.data?.bankrate || 0);
      setAllWalletData(res.data?.allwallet || []);
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return { walletData, bankrate, allWalletData, loading, fetchWallet };
}
