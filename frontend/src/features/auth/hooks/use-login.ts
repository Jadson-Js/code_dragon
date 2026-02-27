import { useMutation } from "@tanstack/react-query";
import { login } from "../api/login";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (_data) => {
      // Aqui você salvaria o token no localStorage ou cookie
      // localStorage.setItem('token', data.token);
      toast.success("Login realizado com sucesso!");
      navigate("/"); // Redireciona para a home após login
    },
    onError: () => {
      toast.error("Erro ao realizar login.");
    },
  });
}
