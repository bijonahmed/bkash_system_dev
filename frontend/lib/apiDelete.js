import { toast } from "react-hot-toast";

/**
 * Reusable DELETE request function
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {string|number} id - Resource ID to delete
 * @param {string} token - Bearer token
 * @param {function} onSuccess - Optional callback on success
 */
export const apiDelete = async ({ endpoint, id, token, onSuccess }) => {
  if (!id) {
    toast.error("Invalid ID");
    return;
  }

  if (!confirm("Are you sure you want to delete this item?")) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${endpoint}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Delete failed");
      return;
    }

    toast.success("Deleted successfully");

    if (onSuccess && typeof onSuccess === "function") {
      onSuccess(data);
    }
  } catch (err) {
    console.error("Delete failed:", err);
    toast.error("Something went wrong");
  }
};
