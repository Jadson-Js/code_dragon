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
      // Atualiza o cache do usuário imediatamente para evitar redirecionamento incorreto
      queryClient.setQueryData(["auth-user"], (old: any) => {
        if (!old) return old;
        return { ...old, hasProfile: true };
      });

      // Invalida para garantir que os dados do servidor sejam sincronizados
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });

      // Aguardar a animação por 4 segundos antes de navegar
      setTimeout(() => navigate("/"), 4000);
    },
    onError: () => {
      toast.error("Erro ao realizar o setup do perfil");
    },
  });

  return { form, mutation };
}
