import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { signupSchema, type SignupFormData } from "../schemas/signupSchema";
import { api } from "@/lib/api-client";

export function useSignup() {
  const navigate = useNavigate();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: SignupFormData) => api.post("/auth/signup", data),
    onSuccess: (_data, variables) => {
      form.reset();
      navigate("/auth/verify-email", { state: { email: variables.email } });
    },
    onError: () => {
      toast.error("Erro ao criar conta");
    },
  });

  return { form, mutation };
}
