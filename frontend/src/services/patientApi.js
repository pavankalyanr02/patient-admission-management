
const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data.detail;

    const message = Array.isArray(detail)
      ? detail.map(error => error.msg).join(" ")
      : detail;

    throw new Error(
      message || "Something went wrong. Please try again."
    );
  }

  return data;
}
