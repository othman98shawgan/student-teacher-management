import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7178/api", // change as needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Attach token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
