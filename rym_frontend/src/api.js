export const API_BASE = "https://rym-backend.onrender.com/api/albums";

export async function fetchJSON(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`);
  return await res.json();
}