"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // adjust path
import { apiGet } from "../../lib/apiGet";

export default function useAgents() {
  const [agentData, setAgentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchAgents = useCallback(async () => {
    if (!token) return; // prevent API call if token is not ready

    setLoading(true);
    try {
      const res = await apiGet({ endpoint: "/users/getOnlyAgentList", token });
      //console.log("===" + res?.data.data);
      setAgentData(res?.data.data);
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
