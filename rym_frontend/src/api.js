export const API_BASE = "http://localhost:3000/api/albums";

export async function fetchJSON(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`);
  return await res.json();
}