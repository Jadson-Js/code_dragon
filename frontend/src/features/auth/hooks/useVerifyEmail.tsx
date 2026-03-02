import axios from "axios";
import { env } from "@/shared/environments";
import { toast } from "sonner";
import { useState } from "react";

export function useVerifyEmail() {
  const [status, setStatus] = useState<"success" | "error" | "pending">(
    "pending",
  );

  const verifyEmail = async (token: string) => {
    try {
      await axios.post(`${env.serverUrl}/auth/verify-email`, {
        token,
      });

      setStatus("success");
      toast.success("E-mail verificado com sucesso!");
    } catch (error: any) {
      setStatus("error");
      console.log(error);
      toast.error("Erro ao verificar e-mail");
    }
  };

  return {
    verifyEmail,
    status,
  };
}
