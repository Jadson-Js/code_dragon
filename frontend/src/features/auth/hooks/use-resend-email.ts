import { useMutation } from "@tanstack/react-query";
import { resendEmail } from "../api/resend-email";
import { toast } from "sonner";

export function useResendEmail() {
  return useMutation({
    mutationFn: resendEmail,
    onSuccess: () => {
      toast.success("E-mail de verificação reenviado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao reenviar e-mail.");
    },
  });
}
