import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/lib/api-client";

export function useForgotPassword() {
  const [isSending, setIsSending] = useState(false);

  const forgotPassword = async (email: string) => {
    setIsSending(true);
    try {
      await api.post("/auth/forgot-password", {
        email,
      });
      toast.success("E-mail de recuperação enviado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao enviar e-mail de recuperação");
    } finally {
      setIsSending(false);
    }
  };

  return {
    forgotPassword,
    isSending,
  };
}
