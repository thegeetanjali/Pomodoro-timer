import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  timeout: 10000,
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateMe: (data) => api.patch("/auth/me", data),
};

// ── Sessions ────────────────────────────────────────────────────
export const sessionAPI = {
  create: (data) => api.post("/sessions", data),
  getAll: (params) => api.get("/sessions", { params }),
  delete: (id) => api.delete(`/sessions/${id}`),
};

// ── Analytics ───────────────────────────────────────────────────
export const analyticsAPI = {
  getSummary: () => api.get("/analytics/summary"),
};

export default api;
