import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

export function useResendVerification() {
  const mutation = useMutation({
    mutationFn: (email: string) =>
      api.post("/auth/resend-verification", { email }),
    onSuccess: () => {
      toast.success("E-mail de verificação reenviado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao reenviar e-mail de verificação");
    },
  });

  return { mutation };
}
