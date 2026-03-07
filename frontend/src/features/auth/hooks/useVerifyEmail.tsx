import axios from "axios";
import { env } from "@/shared/environments";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/lib/api-client";

export function useVerifyEmail() {
  const [status, setStatus] = useState<"success" | "error" | "pending">(
    "pending",
  );

  const verifyEmail = async (token: string) => {
    try {
      await api.post("/auth/verify-email", {
        token,
      });

      setStatus("success");
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
