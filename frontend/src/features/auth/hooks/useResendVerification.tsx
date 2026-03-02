import axios from "axios";
import { env } from "@/shared/environments";
import { toast } from "sonner";
import { useState } from "react";

export function useResendVerification() {
  const [isResending, setIsResending] = useState(false);

  const resendVerification = async (email: string) => {
    setIsResending(true);
    try {
      await axios.post(`${env.serverUrl}/auth/resend-verification`, {
        email,
      });
      toast.success("E-mail de verificação reenviado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao reenviar e-mail de verificação");
    } finally {
      setIsResending(false);
    }
  };

  return {
    resendVerification,
    isResending,
  };
}
