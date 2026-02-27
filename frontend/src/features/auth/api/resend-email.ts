import { api } from "@/lib/api-client";
import type { ResendEmailValues } from "../schemas/resend-email-schema";

export async function resendEmail(data: ResendEmailValues) {
  const response = await api.post("/auth/resend-email", data);
  return response.data;
}
