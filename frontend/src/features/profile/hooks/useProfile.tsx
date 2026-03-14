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
      setTimeout(() => {
        queryClient.resetQueries({ queryKey: ["auth-user"] });
        navigate("/");
      }, 5000);
    },
    onError: () => {
      toast.error("Erro ao realizar o setup do perfil");
    },
  });

  return { form, mutation };
}
