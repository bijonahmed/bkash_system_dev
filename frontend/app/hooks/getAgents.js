"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // adjust path

export default function useAgents() {
  const [agentData, setAgentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchAgents = useCallback(async () => {
    if (!token) return; // prevent API call if token is not ready

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

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.message || `HTTP Error: ${res.status}`);
      }

      setAgentData(result?.data || []);
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }, [token]); // useCallback depends on token

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]); // useEffect depends on fetchAgents

  return { agentData, loading, refetch: fetchAgents };
}
