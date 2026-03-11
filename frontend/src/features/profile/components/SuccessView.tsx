import { Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function SuccessView() {
  const [particles, setParticles] = useState<
    { id: number; left: string; delay: string; color: string; size: string }[]
  >([]);

  useEffect(() => {
    // Gerar partículas de confete de forma dinâmica
    const colors = ["#6366f1", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"];
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: `${Math.random() * 10 + 5}px`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
      {/* Ícone de Sucesso Animado */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-green/10 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-20 h-20 bg-green/20 rounded-full flex items-center justify-center animate-bounce duration-1000">
            <Check className="w-12 h-12 text-green" />
          </div>
        </div>
        {/* Anéis de pulso */}
        <div className="absolute inset-0 border-4 border-green/30 rounded-full animate-ping opacity-20" />
      </div>

      <h2 className="typ-h1 text-white-1 mb-4">Perfil Criado!</h2>
      <p className="text-white-2 max-w-md text-lg leading-relaxed">
        Tudo pronto! Estamos preparando seu ambiente. <br />
        Bem-vindo ao <strong>CodeDragon</strong>.
      </p>

      {/* Partículas de Confete em CSS */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute top-[-20px] rounded-sm opacity-0"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              animation: `confetti-fall 3s ease-out forwards ${p.delay}`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
