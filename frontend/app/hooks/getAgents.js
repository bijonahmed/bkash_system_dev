"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // adjust path

export default function getWallet() {
  const [agentData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, permissions } = useAuth();
  // useCallback ensures the function is memoized (won’t re-create unnecessarily)
  const getwallet = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/users/getOnlyAgentList`;
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
    getwallet();
  }, []);

  return { agentData, loading, getwallet };
}
