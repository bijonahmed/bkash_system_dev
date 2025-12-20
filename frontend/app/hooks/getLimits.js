"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../../lib/apiGet";

export default function useLimits() {
  const [limitData, setLimitData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchLimits = useCallback(async () => {
    if (!token) return; // prevent API call until token is ready

    setLoading(true);

    try {
      const res = await apiGet({ endpoint: "/setting/getLimits", token });
      //console.log("===" + res?.data.data);
      setLimitData(res?.data.data);
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }

  }, [token]); // FIXED: add token dependency

  useEffect(() => {
    fetchLimits();
  }, [fetchLimits]); // FIXED: add callback instead of empty array

  return { limitData, loading, refetch: fetchLimits };
}
