import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { api } from "@/lib/api-client";

export function useLogin() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      reset();
      navigate("/");
      return response;
    } catch (error) {
      toast.error("Erro ao realizar login");
      return error;
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    reset,
    onSubmit,
  };
}
