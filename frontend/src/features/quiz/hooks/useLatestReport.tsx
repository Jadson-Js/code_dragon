import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QuizInsightPayload } from "../types/quiz-report.types";

export function useLatestReport() {
  return useQuery({
    queryKey: ["latest-report"],
    queryFn: async (): Promise<QuizInsightPayload> => {
      const response = await api.get("/quiz/report/latest");
      return response.data;
    },
    retry: false,
  });
}
