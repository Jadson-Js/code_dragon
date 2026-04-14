import { cn } from "@/shared/utils";
import {
  House,
  Activity,
  Mic,
  UserSearch,
  Lightbulb,
  Settings,
  Loader2,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useCallback, useState } from "react";
import { useQuizSession } from "@/features/quiz/hooks/useQuizSession";
import QuizConfigModal from "./QuizConfigModal";

export default function DashboardSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { getSession } = useQuizSession();

  const [quizSession, setQuizSession] = useState(() => getSession());
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const refreshSession = useCallback(() => {
    setQuizSession(getSession());
  }, [getSession]);

  useEffect(() => {
    refreshSession();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "@code_dragon:active_quiz_session") {
        refreshSession();
      }
    };

    const interval = setInterval(refreshSession, 1000);
    window.addEventListener("storage", handleStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshSession]);

  const navItems = [
    { label: "Home", to: "/", icon: House },
    { label: "Diagnósticos", to: "/quiz", icon: Activity },
    { label: "Entrevista IA", to: "/interview", icon: Mic },
    { label: "Auditoria Perfil", to: "/audit", icon: UserSearch },
    { label: "Caixa de Sugestões", to: "/suggestions", icon: Lightbulb },
    { label: "Configurações", to: "/settings", icon: Settings },
  ];

  return (
    <div className="w-3xs bg-bg-2 px-4 py-8 border-r border-bg-3 h-screen fixed">
      <div className="h-12 mb-12">
        <img src="/logo.svg" alt="logo" className="h-full" />
      </div>

      <div className="flex flex-col gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);

          const isQuizLink = item.to === "/quiz";
          const hasQuizSession = isQuizLink && !!quizSession;
          const isGenerating =
            isQuizLink && quizSession?.status === "generating";

          const handleClick = (e: React.MouseEvent) => {
            if (isQuizLink) {
              e.preventDefault();
              if (hasQuizSession && quizSession?.route) {
                navigate(quizSession.route, {
                  ...(quizSession.status === "generating"
                    ? { state: { formData: (quizSession as any).formData } }
                    : {}),
                });
              } else {
                setIsQuizModalOpen(true);
              }
            }
          };

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={handleClick}
              className={cn(
                "text-white-2  hover:text-white-1  transition-colors duration-200",
                isActive && "text-white-1",
              )}
            >
              <div
                className={cn(
                  "flex gap-2 p-2 rounded-sm transition-colors duration-200 w-full items-center",
                  isActive && "bg-primary-1",
                )}
              >
                <Icon size={20} />
                <span className="flex-1">{item.label}</span>

                {/* Active quiz session indicator */}
                {hasQuizSession && (
                  <span
                    className={cn(
                      "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm",
                      isGenerating
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-green/20 text-green",
                    )}
                  >
                    {isGenerating ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-green inline-block" />
                    )}
                    {isGenerating ? "Gerando" : "Ativo"}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Modal de Configuração do Quiz */}
      <QuizConfigModal
        open={isQuizModalOpen}
        onOpenChange={setIsQuizModalOpen}
      />
    </div>
  );
}
