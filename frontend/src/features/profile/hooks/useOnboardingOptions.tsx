import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export interface IOnboardingOptions {
  seniorities: { id: number; name: string; description: string }[];
  specialties: { id: number; name: string; description: string }[];
  careerObjectives: { id: number; name: string; description: string }[];
  ageRanges: { id: number; name: string }[];
  stacks: { id: number; name: string }[];
}

export function useOnboardingOptions() {
  const { data, isLoading } = useQuery<IOnboardingOptions>({
    queryKey: ["onboarding-options"],
    queryFn: () =>
      api.get("/profiles/onboarding-options").then((res) => res.data),
    retry: false,
  });

  return { data, isLoading };
}
