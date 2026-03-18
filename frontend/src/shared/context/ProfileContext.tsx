import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";

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

interface IProfileContextData {
  profile: IProfile | undefined;
  isLoading: boolean;
}

// 2. Criação do Contexto (começa vazio ou undefined)
const ProfileContext = createContext<IProfileContextData | undefined>(
  undefined,
);

// 3. O componente Provider que vai envolver a aplicação
export function ProfileProvider({ children }: { children: ReactNode }) {
  const { data: profile, isLoading } = useQuery<IProfile>({
    queryKey: ["profile"],
    queryFn: () => api.get("/profiles/me").then((res) => res.data),
    retry: false,
  });

  return (
    <ProfileContext.Provider value={{ profile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile deve ser usado dentro de um ProfileProvider");
  }
  return context;
}
