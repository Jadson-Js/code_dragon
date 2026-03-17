import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { Mic } from "lucide-react";
import type { IFeature } from "./DashboardFeatures";

interface Props {
  feature: IFeature;
  className?: string;
  progressValue?: number; // Optional prop to make it dynamic
}

export default function DashboardFeatureCard({ feature, className }: Props) {
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

      <Button size="lg" className="w-full mb-8">
        INICIAR
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
              className="flex-1 border-r-[4px] border-bg-2 last:border-none" 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
