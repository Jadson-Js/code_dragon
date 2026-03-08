import { Navigate, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { LoadingScreen } from "@/components/loading-screen";

export function ProtectedRoute() {
  const { isLoading, isError } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data;
    },
    retry: false,
  });

  if (isLoading) return <LoadingScreen />;

  if (isError) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
