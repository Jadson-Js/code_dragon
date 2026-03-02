import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "../schemas/signupSchema";
import { env } from "@/shared/environments";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function useSignup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      const [day, month, year] = data.birthDate.split("/");
      const dataFormatted = {
        ...data,
        birthDate: `${year}-${month}-${day}`,
      };

      const response = await axios.post(
        env.serverUrl + "/auth/signup",
        dataFormatted,
      );
      reset();
      toast.success("Conta criada com sucesso!");
      navigate("/auth/verify-email", { state: { email: data.email } });
      return response;
    } catch (error) {
      toast.error("Erro ao criar conta");
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
