import axios from "axios";
import { env } from "@/shared/environments";

export const api = axios.create({
  baseURL: env.serverUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para tratamento global de erros (opcional, mas recomendado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response.data.error || "Ocorreu um erro inesperado.";
    return Promise.reject(new Error(message));
  },
);
