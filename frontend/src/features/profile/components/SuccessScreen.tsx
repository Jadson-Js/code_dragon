import { Check, Loader2 } from "lucide-react";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function SuccessScreen() {
  useEffect(() => {
    // Dispara confetes ao montar o componente
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetes de dois lados
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#6366f1", "#10b981", "#3b82f6"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#6366f1", "#10b981", "#3b82f6"],
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 relative overflow-hidden min-h-[400px]">
      {/* Success Icon Container */}
      <div className="relative mb-10 group">
        <div className="w-28 h-28 bg-green/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-green/20 shadow-[0_0_40px_rgba(16,185,129,0.2)] animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green/20 rounded-full flex items-center justify-center">
            <Check className="w-12 h-12 text-green stroke-[3px]" />
          </div>
        </div>
      </div>

      <h2 className="typ-h1 text-white-1 mb-4">Parabéns!</h2>

      <h3 className="typ-h2 text-green/90 mb-4">
        Seu perfil foi configurado com sucesso
      </h3>

      {/* Loading Progress Bar Indicator */}
      <div className="mt-12 flex flex-col items-center gap-4 animate-in fade-in duration-1000 delay-500">
        <div className="flex items-center gap-2 text-white-2 text-sm font-medium tracking-wide uppercase">
          <Loader2 className="w-4 h-4 animate-spin text-primary-1" />
          Inicializando seu Workspace...
        </div>

        <div className="w-64 h-1.5 bg-bg-3 rounded-full overflow-hidden">
          <div className="h-full bg-primary-1 rounded-full animate-progress-fill origin-left" />
        </div>
      </div>

      <style>{`
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-progress-fill {
          animation: progress-fill 2s linear forwards;
        }
      `}</style>
    </div>
  );
}
