import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { api } from "@/lib/api-client";

export function useLogin() {
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => api.post("/auth/login", data),
    onSuccess: () => {
      form.reset();
      navigate("/");
    },
    onError: async (error: any, variables) => {
      if (error.response?.status === 401) {
        await api.post("/auth/resend-verification", {
          email: variables.email,
        });
        navigate("/auth/verify-email", { state: { email: variables.email } });
      }
      toast.error("Erro ao realizar login");
    },
  });

  return { form, mutation };
}
