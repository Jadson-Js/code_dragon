import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  profileSetupSchema,
  type ProfileSetupFormData,
} from "../schemas/profileSetupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export function useProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ProfileSetupFormData) => api.post("/profiles", data),
    onSuccess: () => {
      // Aguardar a animação do SuccessScreen por 4 segundos antes de atualizar o cache e navegar
      setTimeout(() => {
        // Atualiza o cache do usuário AGORA, o que permitirá o acesso às rotas protegidas
        queryClient.setQueryData(["auth-user"], (old: any) => {
          if (!old) return old;
          return { ...old, hasProfile: true };
        });

        // Invalida para garantir sincronia nas próximas requisições
        queryClient.invalidateQueries({ queryKey: ["auth-user"] });

        // Navega para o dashboard
        navigate("/");
      }, 5000);
    },
    onError: () => {
      toast.error("Erro ao realizar o setup do perfil");
    },
  });

  return { form, mutation };
}
