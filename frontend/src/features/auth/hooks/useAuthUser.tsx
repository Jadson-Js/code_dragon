import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export function useAuthUser() {
  return useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data;
    },
    retry: false,
    staleTime: Infinity,
  });
}
