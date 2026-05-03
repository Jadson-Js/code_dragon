import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { env } from "@/shared/environments";

export function useOptionalAuthUser() {
  return useQuery({
    queryKey: ["auth-user-optional"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${env.serverUrl}/auth/me`, {
          withCredentials: true,
        });
        return data;
      } catch (err) {
        // Se falhou com 401, tentamos dar um refresh manual uma vez
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          try {
            await axios.post(
              `${env.serverUrl}/auth/refresh`,
              {},
              { withCredentials: true },
            );
            const { data: retryData } = await axios.get(
              `${env.serverUrl}/auth/me`,
              { withCredentials: true },
            );
            return retryData;
          } catch {
            return null;
          }
        }
        return null;
      }
    },
    staleTime: Infinity,
  });
}
