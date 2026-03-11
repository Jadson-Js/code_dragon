import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas/forgotPasswordSchema";
import { api } from "@/lib/api-client";

export function useForgotPassword() {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordFormData) =>
      api.post("/auth/forgot-password", data),
    onSuccess: () => {
      toast.success("E-mail de recuperação enviado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao enviar e-mail de recuperação");
    },
  });

  return { form, mutation };
}
