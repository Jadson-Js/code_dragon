import axios from "axios";
import { env } from "@/shared/environments";

export const api = axios.create({
  baseURL: env.serverUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Criamos uma instância dedicada apenas para o refresh para não entrar no interceptor de erro
const refreshApi = axios.create({
  baseURL: env.serverUrl,
  withCredentials: true,
});

let refreshPromise: Promise<any> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 E NÃO for na rota de refresh
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        // Usamos a refreshApi (instância limpa) para evitar recursão
        refreshPromise = refreshApi.post("/auth/refresh").finally(() => {
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
    }

    return Promise.reject(error);
  },
);
