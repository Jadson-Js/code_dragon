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
      quizSubjectIds: [],
    },
  });

  const mutation = useMutation({
    mutationFn: (data: QuizQuestionsGenerateFormData) =>
      api.post("/quiz/questions/generate", data),
    onSuccess: () => {
      form.reset();
      navigate("/");
    },
    onError: async () => {
      toast.error("Erro ao gerar questões");
    },
  });

  return { form, mutation };
}
