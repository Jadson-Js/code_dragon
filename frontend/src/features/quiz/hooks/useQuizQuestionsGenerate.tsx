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
import { useQuizSession } from "./useQuizSession";

export function useQuizQuestionsGenerate() {
  const navigate = useNavigate();
  const { setGenerating, setActive, clearSession } = useQuizSession();

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
    mutationFn: async (data: QuizQuestionsGenerateFormData) => {
      // Persist "generating" state right before the API call so the dashboard
      // knows a quiz is in progress even if the user navigates away.
      setGenerating(data);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return {
        data: { sessionQuizId: "702b9ce6-fc43-4791-be94-9498de081a30" },
      };
    },
    // mutationFn: async (data: QuizQuestionsGenerateFormData) => {
    //   setGenerating(data);
    //   return api.post<{ sessionQuizId: string }>(
    //     "/quiz/questions/generate",
    //     data,
    //   );
    // },
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

      // Upgrade session to "active" with the real session ID.
      setActive(data.data.sessionQuizId);
      navigate(`/quiz/session/${data.data.sessionQuizId}`);
    },
    onError: async () => {
      // Clear the pending session if generation fails.
      clearSession();
      toast.error("Erro ao gerar questões");
    },
  });

  return { form, mutation };
}
