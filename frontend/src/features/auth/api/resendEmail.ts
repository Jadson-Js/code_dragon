import { api } from "@/lib/api-client";
import type { ResendEmailValues } from "../schemas/resend-email-schema";

export async function API_RESEND_EMAIL(data: ResendEmailValues) {
  const response = await api.post("/auth/resend-email", data);
  return response.data;
}
