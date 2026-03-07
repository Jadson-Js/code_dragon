import axios from "axios";
import { env } from "@/shared/environments";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/lib/api-client";

export function useResendVerification() {
  const [isResending, setIsResending] = useState(false);

  const resendVerification = async (email: string) => {
    setIsResending(true);
    try {
      await api.post("/auth/resend-verification", {
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
