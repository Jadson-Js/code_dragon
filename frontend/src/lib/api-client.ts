import axios from "axios";
import { env } from "@/shared/environments";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: env.serverUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<any> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = api.post("/auth/refresh").finally(() => {
        refreshPromise = null;
      });
    }

    try {
      await refreshPromise;

      return api(originalRequest);
    } catch (refreshError) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      return Promise.reject(refreshError);
    }
  },
);
