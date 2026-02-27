import { useMutation } from "@tanstack/react-query";
import { API_RESEND_EMAIL } from "../api/resendEmail";
import type { ResendEmailValues } from "../schemas/resend-email-schema";
import { toast } from "sonner";

export function useResendEmail() {
  return useMutation({
    mutationFn: (data: ResendEmailValues) => API_RESEND_EMAIL(data),
    onSuccess: () => {
      toast.success("E-mail de verificação reenviado com sucesso!");
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao reenviar e-mail.");
      console.log(err);
    },
  });
}
