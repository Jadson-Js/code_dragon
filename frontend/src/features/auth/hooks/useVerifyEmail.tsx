import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

export function useVerifyEmail() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (token: string) => api.post("/auth/verify-email", { token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
    onError: () => {
      toast.error("Erro ao verificar e-mail");
    },
  });

  return { mutation };
}
