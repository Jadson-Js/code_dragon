import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { Mic } from "lucide-react";

interface Props {
  className?: string;
  progressValue?: number; // Optional prop to make it dynamic
}

export default function DashboardFeatureCard({ className }: Props) {
  return (
    <div className={cn("bg-bg-2 card", className)}>
      {/* Header section with Icon and Category */}
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-bg-1 card p-2">
          <Mic className="text-primary-1" size={20} />
        </div>

        <span className="text-white-2">Entrevistas IA</span>
      </div>

      {/* Description */}
      <p className="text-white-2 mb-8">
        Avalie suas habilidades técnicas com quizzes personalizados e descubra
        pontos de melhoria.
      </p>

      <Button size="lg" className="w-full mb-8">
        INICIAR
      </Button>

      {/* Progress / Stats Footer */}

      <div className="flex flex-col mb-4">
        <div className="flex gap-2 items-baseline">
          <span className="text-white-1 typ-h2">8</span>
          <span className="text-white-2 typ-caption">de 10</span>
        </div>
        <span className="text-white-2 typ-caption">simulações restantes</span>
      </div>

      {/* Custom Progress Bar */}
      <div className="w-full h-2 bg-bg-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-green rounded-full animate-progress-grow shadow-[0_0_8px_rgba(16,185,129,0.4)]"
          style={{ width: `80%` }}
        />
      </div>
    </div>
  );
}
