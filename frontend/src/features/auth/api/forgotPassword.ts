import { api } from "@/lib/api-client";
import type { ForgotPasswordValues } from "../schemas/forgot-password-schema";

export async function API_FORGOT_PASSWORD(data: ForgotPasswordValues) {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
}
