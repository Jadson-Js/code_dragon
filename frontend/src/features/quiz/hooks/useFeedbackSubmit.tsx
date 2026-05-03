import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

interface SubmitFeedbackParams {
  rate: number;
  description: string;
  reason: string;
  sessionId?: string;
  featureId?: number;
}

export function useFeedbackSubmit() {
  return useMutation({
    mutationFn: async (data: SubmitFeedbackParams) => {
      console.log(data);

      const response = await api.post("/feedbacks", data);
      return response.data;
    },
  });
}
