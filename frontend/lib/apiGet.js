export const apiGet = async ({ endpoint, params = {}, token = "" }) => {
  try {
    // Build Query Params
    const queryString = new URLSearchParams(params).toString();
    // Build Full URL
    const base = process.env.NEXT_PUBLIC_API_BASE;
    const url = `${base}${endpoint}?${queryString}`;
    // Prepare Headers
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    // Fire GET Request
    const response = await fetch(url, { method: "GET", headers });
    const data = await response.json();
    // Handle Error
    if (!response.ok) return { success: false, error: data.message };
    // Success Response
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Network or server error!" };
  }
};
