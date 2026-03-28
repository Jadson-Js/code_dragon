import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

interface IQuizOptions {
  quizObjectives: { id: number; name: string }[];
  quizSubjects: {
    id: number;
    name: string;
    specialties: { id: number; name: string }[];
  }[];
  seniorities: { id: number; name: string }[];
  specialties: { id: number; name: string }[];
  stacks: { id: number; name: string }[];
}

export function useGetQuizOptions() {
  const { data, isLoading } = useQuery<IQuizOptions>({
    queryKey: ["quiz-options"],
    queryFn: () => api.get("/quiz/options").then((res) => res.data),
    retry: false,
  });

  return { data, isLoading };
}
