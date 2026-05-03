import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";

interface FeedbackToastProps {
  onRate: () => void;
  onClose: () => void;
}

export default function FeedbackToast({ onRate, onClose }: FeedbackToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 w-full max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-500",
        "bg-bg-2 border border-bg-3 rounded-xl p-5 shadow-2xl"
      )}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white-2 hover:text-white-1 transition-colors cursor-pointer"
      >
        <X size={20} />
      </button>

      <div className="flex items-start gap-4">
        <div className="bg-yellow/10 p-2 rounded-lg shrink-0">
          <Star className="text-yellow fill-yellow" size={24} />
        </div>

        <div className="space-y-1 pr-6">
          <h3 className="text-white-1 font-semibold text-lg leading-tight">
            Avalie esta análise
          </h3>
          <p className="text-white-2 text-sm leading-relaxed">
            Ajude-nos a melhorar os resultados
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 bg-transparent border-bg-3 text-white-2 hover:text-white-1"
          onClick={onClose}
        >
          Agora não
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex-1 bg-primary-1 hover:bg-primary-1/90 text-white font-semibold"
          onClick={onRate}
        >
          Avaliar
        </Button>
      </div>
    </div>
  );
}
