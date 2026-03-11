import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  profileSetupSchema,
  type ProfileSetupFormData,
} from "../schemas/profileSetupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = React.useState(false);

  const methods = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      ageRangeId: 0,
      seniorityId: 0,
      specialtyId: 0,
      careerObjectiveId: 0,
      stacksId: [],
    },
  });

  const onSubmit: SubmitHandler<ProfileSetupFormData> = async (data) => {
    try {
      await api.post("/profiles", data);
      setIsSuccess(true);

      // Atualiza o cache do usuário imediatamente para evitar redirecionamento incorreto
      queryClient.setQueryData(["auth-user"], (old: any) => {
        if (!old) return old;
        return { ...old, hasProfile: true };
      });

      // Invalida para garantir que os dados do servidor sejam sincronizados
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });

      // Aguardar a animação por 4 segundos antes de navegar
      setTimeout(() => navigate("/"), 4000);
    } catch (error: any) {
      toast.error("Erro ao realizar o setup do perfil");
    }
  };

  return {
    methods,
    onSubmit,
    isSuccess,
  };
}
