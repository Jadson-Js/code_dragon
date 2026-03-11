import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/resetPasswordSchema";
import { api } from "@/lib/api-client";

export type ResetPasswordError = "token" | "generic";

export function useResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordFormData) =>
      api.post("/auth/reset-password", {
        token: data.token,
        password: data.password,
      }),
    onSuccess: () => {
      navigate("/auth/login");
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const message: string = error?.response?.data?.error ?? "";

      if (status === 400 && message.toLowerCase().includes("token")) {
        toast.error("Token inválido ou expirado. Solicite um novo link.");
        navigate("/auth/forgot-password");
        return;
      }

      toast.error("Erro ao redefinir senha. Tente novamente.");
    },
  });

  return { form, mutation };
}
