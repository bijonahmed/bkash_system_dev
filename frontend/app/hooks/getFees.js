"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../../lib/apiGet";

export default function useFees() {
  const [feesData, setFeesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchFees = useCallback(async () => {
    if (!token) return; // prevent API call until token is ready
    setLoading(true);

    try {
      const res = await apiGet({ endpoint: "/setting/getFees", token });
      //console.log("===" + res?.data.data);
      setFeesData(res?.data.data || []);
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
   
  }, [token]); // FIXED dependency

  useEffect(() => {
    fetchFees();
  }, [fetchFees]); // FIXED dependency

  return { feesData, loading, refetch: fetchFees };
}
