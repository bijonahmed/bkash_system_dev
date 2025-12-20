import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { apiGet } from "../../lib/apiGet";
import { useAuth } from "../context/AuthContext";

export default function useTranSactionAutoCoplete(beneficiaryPhone) {
  const [autcompleteData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetechTranAutocmoplete = useCallback(async (phone) => {
    if (!token) return;

    setLoading(true);
    try {
      // Send phone as query parameter
      const res = await apiGet({
        endpoint: `/transaction/checkedBenPhone?phone=${phone || ""}`,
        token,
      });
      setResponseData(res?.data.data ?? []);
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Call API whenever beneficiaryPhone changes
  useEffect(() => {
    if (beneficiaryPhone && beneficiaryPhone.length >= 3) { // optional min length
      fetechTranAutocmoplete(beneficiaryPhone);
    } else {
      setResponseData([]); // clear if input is too short
    }
  }, [beneficiaryPhone, fetechTranAutocmoplete]);

  return { autcompleteData, loading, refetchAutocomplete: fetechTranAutocmoplete };
}
