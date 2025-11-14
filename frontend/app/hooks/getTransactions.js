"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // adjust path

export default function getTransactions() {
  const [transactionData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, permissions } = useAuth();
  // useCallback ensures the function is memoized (won’t re-create unnecessarily)
  const getTransactions = useCallback(async (filters = {}) => {

    
    const cleaned = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v)
    );

    const query = new URLSearchParams(cleaned).toString();

    console.log("QUERY:", query);

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/transaction/index`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      let result;
      try {
        result = await res.json();
      } catch (e) {
        result = null;
      }

      if (!res.ok) {
        throw new Error(result?.message || `HTTP Error: ${res.status}`);
      }

      setResponseData(result?.data || []);
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getTransactions();
  }, []);

  return { transactionData, loading, refetch: getTransactions };
}
