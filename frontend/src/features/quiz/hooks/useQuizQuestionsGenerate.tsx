import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { api } from "@/lib/api-client";
import {
  quizQuestionsGenerateSchema,
  type QuizQuestionsGenerateFormData,
} from "@/features/dashboard/schemas/useQuizQuestionsGenerate";

export function useQuizQuestionsGenerate() {
  const navigate = useNavigate();

  const form = useForm<QuizQuestionsGenerateFormData>({
    resolver: zodResolver(quizQuestionsGenerateSchema),
    defaultValues: {
      saveInProfile: false,
      quizSubjectsId: [],
      stacksId: [],
      quizObjectiveId: 0,
      seniorityId: 0,
      specialtyId: 0,
      quantity: 1,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: QuizQuestionsGenerateFormData) =>
      api.post("/quiz/questions/generate", data),
    onSuccess: (data, variables) => {
      if (variables.saveInProfile) {
        localStorage.setItem(
          "@code_dragon:quiz_config",
          JSON.stringify({
            quizObjectiveId: variables.quizObjectiveId,
            quizSubjectsId: variables.quizSubjectsId,
            quantity: variables.quantity,
          }),
        );
      } else {
        localStorage.removeItem("@code_dragon:quiz_config");
      }

      navigate(`/quiz/session/${data.data.sessionQuizId}`, {
        state: { quantity: variables.quantity },
      });
    },
    onError: (error) => {
      const isTooManyRequests =
        isAxiosError(error) && error.response?.status === 429;

      toast.error(
        isTooManyRequests
          ? "Muitas tentativas em pouco tempo. Tente novamente em instantes."
          : "Erro ao gerar questões",
      );

      navigate("/", { replace: true });
    },
  });

  return { form, mutation };
}
