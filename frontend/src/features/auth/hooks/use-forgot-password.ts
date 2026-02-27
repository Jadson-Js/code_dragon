import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../api/forgot-password";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function useForgotPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (_, variables) => {
      navigate(`/forgot-password/${variables.email}`);
    },
    onError: () => {
      toast.error("Erro ao solicitar recuperação de senha.");
    },
  });
}
