import { toast } from "react-hot-toast";

/**
 * Reusable API POST/UPDATE request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} data - Form data or payload
 * @param {string} token - Bearer token
 * @param {function} onSuccess - Optional callback on success
 */
export const apiUpdate = async ({ endpoint, data, token, onSuccess }) => {
  if (!endpoint) {
    toast.error("API endpoint is required");
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${endpoint}`, {
      method: "POST", // use POST for updates
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.message || "Update failed");
      return { success: false, error: result.message || "Update failed" };
    }

    toast.success(result.message || "Updated successfully");

    if (onSuccess && typeof onSuccess === "function") {
      onSuccess(result);
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("API update failed:", error);
    toast.error("Network or server error");
    return { success: false, error: error.message || "Network error" };
  }
};
