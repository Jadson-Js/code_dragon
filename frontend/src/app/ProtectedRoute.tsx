import { Navigate, Outlet, useLocation } from "react-router";
import { LoadingScreen } from "@/components/loading-screen";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

export function ProtectedRoute() {
  const location = useLocation();
  const { data, isPending, isError } = useAuthUser();

  // Se estiver carregando pela primeira vez, mostra Loading
  if (isPending) return <LoadingScreen />;

  // Se deu erro ou NÃO tem dados do usuário, manda para o Login
  if (isError || !data) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // REGRA 1: Se não tem perfil e NÃO está na página /profile -> Manda para o /profile
  if (data.hasProfile === false && location.pathname !== "/profile") {
    return <Navigate to="/profile" replace />;
  }

  // REGRA 2: Se já TEM perfil e TENTA entrar no /profile -> Manda de volta para o Dashboard "/"
  if (data.hasProfile === true && location.pathname === "/profile") {
    return <Navigate to="/" replace />;
  }

  return <Outlet context={data} />;
}
