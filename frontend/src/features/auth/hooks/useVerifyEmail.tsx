import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

export function useVerifyEmail() {
  const mutation = useMutation({
    mutationFn: (token: string) => api.post("/auth/verify-email", { token }),
    onError: () => {
      toast.error("Erro ao verificar e-mail");
    },
  });

  return { mutation };
}
