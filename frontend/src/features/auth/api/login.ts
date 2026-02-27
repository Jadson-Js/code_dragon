import { api } from "@/lib/api-client";
import type { LoginValues } from "../schemas/login-schema";

export async function login(data: LoginValues) {
  const response = await api.post("/auth/login", data);
  return response.data;
}
