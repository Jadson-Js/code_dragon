import axios from "axios";
import { env } from "@/shared/environments";
import { toast } from "sonner";
import { useState } from "react";

export function useVerifyToken() {
  const [status, setStatus] = useState<"success" | "error" | "pending">(
    "pending",
  );

  const verifyToken = async (token: string) => {
    try {
      await axios.post(`${env.serverUrl}/auth/verify-token`, {
        token,
      });
      setStatus("success");
      toast.success("Token verificado com sucesso!");
    } catch (error: any) {
      setStatus("error");
      console.log(error);
      toast.error("Erro ao verificar token");
    }
  };

  return {
    verifyToken,
    status,
  };
}
