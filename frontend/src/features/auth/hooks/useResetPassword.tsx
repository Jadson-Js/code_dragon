import axios from "axios";
import { env } from "@/shared/environments";
import { toast } from "sonner";
import { useState } from "react";
import type { ResetPasswordFormData } from "../schemas/resetPasswordSchema";
import { api } from "@/lib/api-client";

export type ResetPasswordError = "token" | "generic";

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async (
    data: ResetPasswordFormData,
  ): Promise<{ error?: ResetPasswordError }> => {
    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token: data.token,
        password: data.password,
      });

      toast.success("Senha redefinida com sucesso!");
      return {};
    } catch (error: any) {
      const status = error?.response?.status;
      const message: string = error?.response?.data?.error ?? "";

      if (status === 400 && message.toLowerCase().includes("token")) {
        toast.error("Token inválido ou expirado. Solicite um novo link.");
        return { error: "token" };
      }

      toast.error("Erro ao redefinir senha. Tente novamente.");
      return { error: "generic" };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resetPassword,
    isLoading,
  };
}
