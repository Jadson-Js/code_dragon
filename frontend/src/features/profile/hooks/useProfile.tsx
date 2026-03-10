import { useForm, type SubmitHandler } from "react-hook-form";
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
      const response = await api.post("/profiles", data);
      navigate("/");
      return response;
    } catch (error: any) {
      toast.error("Erro ao realizar o setup do perfil");
      return error;
    }
  };

  return {
    methods,
    onSubmit,
  };
}
