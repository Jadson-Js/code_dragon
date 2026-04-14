import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import type { IFeature } from "./DashboardFeatures";
import { useQuizSession } from "@/features/quiz/hooks/useQuizSession";

interface Props {
  feature: IFeature;
  className?: string;
}

/** Feature IDs that have an active-session concept (quiz for now). */
const QUIZ_FEATURE_ID = 1;

export default function DashboardFeatureCard({ feature, className }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { getSession } = useQuizSession();

  // Reactively check session state. We re-check on every render tick so the
  // card updates if the storage value changes (e.g. the tab from which the
  // quiz was started updates storage and the user comes back to dashboard).
  const [sessionRoute, setSessionRoute] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<"generating" | "active" | null>(null);

  const refreshSession = useCallback(() => {
    if (feature.id !== QUIZ_FEATURE_ID) return;
    const s = getSession();
    if (s) {
      setSessionRoute(s.route);
      setSessionStatus(s.status);
    } else {
      setSessionRoute(null);
      setSessionStatus(null);
    }
  }, [feature.id, getSession]);

  useEffect(() => {
    refreshSession();

    // Also listen for changes made by other tabs / components via storage event.
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "@code_dragon:active_quiz_session") {
        refreshSession();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refreshSession]);

  const Modal = feature.modalComponent;
  const isInProgress = feature.id === QUIZ_FEATURE_ID && !!sessionRoute;
  const isGenerating = sessionStatus === "generating";

  const handleButtonClick = () => {
    if (isInProgress && sessionRoute) {
      navigate(sessionRoute, {
        // Re-attach formData as state if it's still in "generating" mode so the
        // Quiz page can resume the mutation if the component was unmounted.
        ...(sessionStatus === "generating"
          ? {
              state: {
                formData: (() => {
                  try {
                    const raw = localStorage.getItem(
                      "@code_dragon:active_quiz_session",
                    );
                    if (!raw) return undefined;
                    const parsed = JSON.parse(raw);
                    return parsed.formData;
                  } catch {
                    return undefined;
                  }
                })(),
              },
            }
          : {}),
      });
    } else {
      setModalOpen(true);
    }
  };

  return (
    <div className={cn("bg-bg-2 card", className)}>
      {/* Header section with Icon and Category */}
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-bg-1 card p-2">
          <feature.icon className="text-primary-1" size={20} />
        </div>

        <span className="text-white-2">{feature.title}</span>
      </div>

      {/* Description */}
      <p className="text-white-2 mb-8">{feature.description}</p>

      <Button
        size="lg"
        className={cn(
          "w-full mb-8 transition-all",
          isInProgress &&
            "bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30",
        )}
        variant={isInProgress ? "outline" : "default"}
        onClick={handleButtonClick}
      >
        {isInProgress ? (
          <>
            {isGenerating && (
              <Loader2 className="animate-spin mr-2" size={16} />
            )}
            EM ANDAMENTO
          </>
        ) : (
          "INICIAR"
        )}
      </Button>

      {/* Progress / Stats Footer */}

      <div className="flex flex-col mb-4">
        <div className="flex gap-2 items-baseline">
          <span className="text-white-1 typ-h2">{feature.used}</span>
          <span className="text-white-2 typ-caption">de {feature.total}</span>
        </div>
        <span className="text-white-2 typ-caption">simulações restantes</span>
      </div>

      {/* Barra de Progresso Animada e Fragmentada */}
      <div className="relative w-full h-2 bg-bg-3 rounded-sm overflow-hidden flex">
        {/* Barra verde contínua com animação */}
        <div
          className="absolute top-0 left-0 h-full bg-green animate-progress-grow shadow-[0_0_8px_rgba(16,185,129,0.4)]"
          style={{ width: `${(feature.used / feature.total) * 100}%` }}
        />

        {/* Máscaras para simular os "espaços" (dashes) do background */}
        <div className="absolute inset-0 flex w-full h-full pointer-events-none">
          {Array.from({ length: feature.total }).map((_, index) => (
            <div
              key={index}
              className="flex-1 border-r-4 border-bg-2 last:border-none"
            />
          ))}
        </div>
      </div>

      {/* Modal de Configuração (ex: Quiz) */}
      {Modal && !isInProgress && (
        <Modal open={modalOpen} onOpenChange={setModalOpen} />
      )}
    </div>
  );
}
