import { useMutation } from "@tanstack/react-query";
import { API_FORGOT_PASSWORD } from "../api/forgotPassword";
import { toast } from "sonner";
import type { ForgotPasswordValues } from "../schemas/forgot-password-schema";
import { useNavigate } from "react-router";

export function useForgotPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ForgotPasswordValues) => API_FORGOT_PASSWORD(data),
    onSuccess: (__data, variables) => {
      navigate(`/forgot-password/${variables.email}`);
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao solicitar recuperação de senha.");
      console.log(err);
    },
  });
}
