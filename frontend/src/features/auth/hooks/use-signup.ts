import { useMutation } from "@tanstack/react-query";
import { API_SIGNUP } from "../api/signup";
import { useNavigate } from "react-router";
import type { SignupValues } from "../schemas/signup-schema";
import { toast } from "sonner";

export function useSignup() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SignupValues) => API_SIGNUP(data),
    onSuccess: (__data, variables) => {
      navigate("/verify-email/" + variables.email);
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao criar conta.");
      console.log(err);
    },
  });
}
