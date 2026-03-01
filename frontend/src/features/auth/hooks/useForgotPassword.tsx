import axios from "axios";
import { env } from "@/shared/environments";
import { toast } from "sonner";
import { useState } from "react";

export function useForgotPassword() {
  const [isSending, setIsSending] = useState(false);

  const forgotPassword = async (email: string) => {
    setIsSending(true);
    try {
      await axios.post(`${env.serverUrl}/auth/forgot-password`, {
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
