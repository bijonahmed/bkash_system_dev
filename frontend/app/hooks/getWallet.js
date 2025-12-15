"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function useGetWallet() {
  const [walletData, setWalletData] = useState([]);
  const [bankrate, setBankRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Memoized fetch function
  const fetchWallet = useCallback(async () => {
    if (!token) return; // prevent unnecessary calls before token loads

    setLoading(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/setting/getwallet`;
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

      setWalletData(result?.data || []);
       setBankRate(result?.bankrate || 0);
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }, [token]); // <-- FIXED: token added

  // Automatically fetch on load & when token changes
  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]); // <-- FIXED: dependency included

  return { walletData, bankrate, loading, fetchWallet };
}
