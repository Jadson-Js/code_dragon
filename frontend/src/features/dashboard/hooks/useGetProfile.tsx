import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

interface IProfile {
  id: string;
  userId: string;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  ageRangeId: number | null;
  seniorityId: number | null;
  specialtyId: number | null;
  careerObjectiveId: number | null;
  stackIds: number[];
}

export function useGetProfile() {
  const { data, isLoading } = useQuery<IProfile>({
    queryKey: ["profile"],
    queryFn: () => api.get("/profiles/me").then((res) => res.data),
    retry: false,
  });

  return { data, isLoading };
}
