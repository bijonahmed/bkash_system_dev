"use client";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function useTransactions() {
  const [transactionData, setTransactionData] = useState([]);
  const [depositApproved, sumDepositApproved] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0); // total pages from backend
  const { token } = useAuth();

  const fetchTransactions = useCallback(
    async ({ filters = {}, page = 1 } = {}) => {
      const cleaned = Object.fromEntries(
        Object.entries({ ...filters }).filter(
          ([_, v]) => v !== "" && v !== null
        )
      );

      cleaned.limit = filters.limit || 50;
      cleaned.page = page;

      const query = new URLSearchParams(cleaned).toString();

      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE}/transaction/index?${query}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (!res.ok) throw new Error(result?.message || "API error");

        setTransactionData(result.data);
        sumDepositApproved(result.sumDepositApproved);
        setTotalPages(result.last_page || 1);
      } catch (err) {
        toast.error(err.message || "Something went wrong!");
      } finally {
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
