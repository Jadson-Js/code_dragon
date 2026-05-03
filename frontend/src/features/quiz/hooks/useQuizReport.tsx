import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QuizInsightPayload } from "../types/quiz-report.types";

export function useQuizReport(sessionQuizId?: string) {
  return useQuery({
    queryKey: ["quiz-report", sessionQuizId],
    queryFn: async (): Promise<QuizInsightPayload> => {
      const response = await api.get(
        `/quiz/report/session_quiz_id/${sessionQuizId}`,
      );
      return response.data;
    },
    enabled: !!sessionQuizId,
  });
}
