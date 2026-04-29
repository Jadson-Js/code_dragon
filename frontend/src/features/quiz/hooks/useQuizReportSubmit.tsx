import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

type QuizReportSubmitInput = {
  sessionQuizId: string;
  answers: {
    quizQuestionId: string;
    selectedCorrectOption: boolean;
    isDisliked: boolean;
  }[];
};

export function useQuizReportSubmit() {
  const mutation = useMutation({
    mutationFn: async (data: QuizReportSubmitInput) => {
      console.log(data);
      return api.post("/quiz/report/submit", data);
    },
  });

  return { mutation };
}
