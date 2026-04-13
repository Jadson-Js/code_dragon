import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
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
    mutationFn: async (_data: QuizQuestionsGenerateFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return {
        data: { sessionQuizId: "4fd2b5f9-b8c9-4bb4-8700-de997116b58c" },
      };
    },
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

      navigate(`/quiz/session/${data.data.sessionQuizId}`);
    },
    onError: async () => {
      toast.error("Erro ao gerar questões");
    },
  });

  return { form, mutation };
}
