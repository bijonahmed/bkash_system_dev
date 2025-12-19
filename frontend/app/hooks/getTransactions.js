"use client";
import { useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../../lib/apiGet";

export default function useTransactions() {
  const [transactionData, setTransactionData] = useState([]);
  const [depositApproved, setDepositApproved] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const { token } = useAuth();

  const inFlightRef = useRef(false);
  const lastQueryRef = useRef("");

  const fetchTransactions = useCallback(
    async ({ filters = {}, page = 1 } = {}) => {
      if (!token) return;

      const cleaned = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "" && v !== null)
      );

      cleaned.limit = filters.limit || 50;
      cleaned.page = page;
      const query = new URLSearchParams(cleaned).toString();
   
      if (query === lastQueryRef.current && inFlightRef.current) return;

      lastQueryRef.current = query;
      inFlightRef.current = true;
      setLoading(true);

      try {
        const res = await apiGet({
          endpoint: `/transaction/index?${query}`,
          token,
        });

        if (!res?.success) {
          throw new Error(res?.message || "API error");
        }

        setTransactionData(res.data?.data || []);
        setDepositApproved(res.data?.sumDepositApproved || 0);
        setTotalPages(res.data?.last_page || 1);
      } catch (err) {
        toast.error(err?.message || "Something went wrong!");
      } finally {
        inFlightRef.current = false;
        setLoading(false);
      }
    },
    [token]
  );

  return {
    transactionData,
    depositApproved,
    loading,
    totalPages,
    refetch: fetchTransactions,
  };
}
