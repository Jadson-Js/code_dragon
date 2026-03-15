import { Sparkles } from "lucide-react";

interface Props {
  className?: string;
}

export default function DashboardHeader({ className }: Props) {
  return (
    <div className={`flex justify-between items-start gap-16 ${className}`}>
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2">
          <Sparkles size={30} className="text-primary-1" />
          <h2 className="text-white-1 typ-h1 font-bold">Olá, Jhon!</h2>
        </div>

        <p className="text-white-2 typ-h3">
          Vamos acelerar sua carreira hoje? Continue praticando e evolua para o
          próximo nível.
        </p>
      </div>

      {/* <div className="flex gap-4">
        <div className="bg-green/20 border border-green px-4 py-2 rounded-sm flex gap-3">
          <div className="flex gap-1 items-center">
            <Mic size={18} className="text-green" />
            <span className="text-green font-bold">8/10</span>
          </div>

          <span className="text-white-2 ">Entrevistas</span>
        </div>

        <div className="bg-green/20 border border-green px-4 py-2 rounded-sm flex gap-3">
          <div className="flex gap-1 items-center">
            <Mic size={18} className="text-green" />
            <span className="text-green font-bold">8/10</span>
          </div>

          <span className="text-white-2 ">Auditorias</span>
        </div>
      </div> */}
    </div>
  );
}
