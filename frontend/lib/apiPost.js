import { toast } from "react-toastify";

/**
 * Global POST/PUT/PATCH helper
 * @param {string} path - API endpoint path
 * @param {object} payload - request body
 * @param {string} token - Bearer token
 * @param {string} method - HTTP method (default: POST)
 * @returns {Promise<{success: boolean, data: any, messages: string[]}>}
 */
export const apiPost = async (path, payload, token, method = "POST") => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
      method: method.toUpperCase(), // allow POST, PUT, PATCH
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) return { success: true, data, messages: [] };

    let messages = [];

    if (res.status === 422 && data?.errors) {
      if (typeof data.errors === "object") {
        Object.values(data.errors).forEach((errorArray) => {
          if (Array.isArray(errorArray)) messages.push(...errorArray);
          else messages.push(errorArray);
        });
      } else {
        messages.push(data.errors);
      }
    } else if (data?.errors) {
      messages.push(data.errors);
    } else if (data?.message) {
      messages.push(data.message);
    } else {
      messages.push("Something went wrong!");
    }

    return { success: false, data, messages };
  } catch (err) {
    console.error(err);
    return { success: false, data: null, messages: ["Network or server error!"] };
  }
};
