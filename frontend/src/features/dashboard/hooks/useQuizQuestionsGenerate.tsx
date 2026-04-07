import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { api } from "@/lib/api-client";
import {
  quizQuestionsGenerateSchema,
  type QuizQuestionsGenerateFormData,
} from "../schemas/useQuizQuestionsGenerate";

export function useQuizQuestionsGenerate() {
  const navigate = useNavigate();

  const form = useForm<QuizQuestionsGenerateFormData>({
    resolver: zodResolver(quizQuestionsGenerateSchema),
    defaultValues: {
      saveInProfile: false,
      quizSubjectIds: [],
      stacksId: [],
      quizObjectiveId: 0,
      seniorityId: 0,
      specialtyId: 0,
      quantity: 1,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: QuizQuestionsGenerateFormData) =>
      api.post("/quiz/questions/generate", data),
    onSuccess: (data, variables) => {
      if (variables.saveInProfile) {
        localStorage.setItem(
          "@code_dragon:quiz_config",
          JSON.stringify({
            quizObjectiveId: variables.quizObjectiveId,
            quizSubjectIds: variables.quizSubjectIds,
            quantity: variables.quantity,
          }),
        );
      } else {
        localStorage.removeItem("@code_dragon:quiz_config");
      }
      console.log(data);

      navigate("/quiz/session/123");
    },
    onError: async () => {
      toast.error("Erro ao gerar questões");
    },
  });

  return { form, mutation };
}
