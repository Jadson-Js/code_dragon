import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/signup";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useSignup() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signup,
    onSuccess: (_, variables) => {
      navigate("/verify-email/" + variables.email);
    },
    onError: () => {
      toast.error("Erro ao criar conta.");
    },
  });
}
