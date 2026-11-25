
// Backend server address
const API = "http://127.0.0.1:8000";

// This function sends requests from React to FastAPI.
export async function apiRequest(path, options = {}) {

  const response = await fetch(`${API}${path}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  // Convert the backend response into JavaScript data.
  const data = await response.json().catch(() => ({}));

  // Check whether the backend returned an error.
  if (!response.ok) {

    const detail = data.detail;

    const message = Array.isArray(detail)
      ? detail.map(error => error.msg).join(" ")
      : detail;

    throw new Error(
      message || "Something went wrong. Please try again."
    );
  }

  // Return successful response data.
  return data;
}
