import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

interface IProfile {
  id: string;
  userId: string;
  linkedinUrl: string | undefined;
  githubUrl: string | undefined;
  portfolioUrl: string | undefined;
  ageRangeId: number | undefined;
  seniorityId: number | undefined;
  specialtyId: number | undefined;
  careerObjectiveId: number | undefined;
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
