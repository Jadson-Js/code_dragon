import { api } from "@/lib/api-client";
import type { ForgotPasswordValues } from "../schemas/forgot-password-schema";

export async function forgotPassword(data: ForgotPasswordValues) {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
}
