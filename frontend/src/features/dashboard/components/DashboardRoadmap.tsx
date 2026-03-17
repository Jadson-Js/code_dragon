import { useState } from "react";
import {
  Brain,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

// --- Types ---

interface Material {
  title: string;
  rating: number;
  students: string;
  image: string;
  discount: string;
}

interface Action {
  id: number;
  text: string;
  priority: "high" | "medium" | "low";
  material?: Material;
}

// --- Components ---

const PriorityBadge = ({ priority }: { priority: Action["priority"] }) => {
  const styles = {
    high: "text-red-400 bg-red-400/10 border-red-400/20",
    medium: "text-yellow bg-yellow/10 border-yellow/20",
    low: "text-green bg-green/10 border-green/20",
  };

  const labels = { high: "Alta", medium: "Média", low: "Baixa" };

  return (
    <span
      className={cn(
        "w-12 px-2 py-1 text-center rounded text-[10px] font-bold uppercase tracking-wider border",
        styles[priority],
      )}
    >
      {labels[priority]}
    </span>
  );
};

const MaterialDropdown = ({ material }: { material: Material }) => (
  <div className="pt-4 mt-4 border-t border-white-1/5 flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
    <div className="w-full md:w-48 aspect-video rounded-sm overflow-hidden shrink-0 border border-white-1/10 shadow-lg">
      <img
        src={material.image}
        alt={material.title}
        className="w-full h-full object-cover"
      />
    </div>

    <div className="flex-1 flex flex-col justify-between py-1">
      <div>
        <h4 className="text-white-1 mb-2">{material.title}</h4>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 leading-none">
            <div className="flex items-center">
              {[...Array(4)].map((_, i) => (
                <Star key={i} size={14} className="fill-yellow text-yellow" />
              ))}
              <Star size={14} className="text-white-2/30" />
            </div>
            <span className="text-white-1 text-xs font-bold pt-0.5">
              {material.rating}/5
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-white-2/60">
            <Users size={14} />
            <span className="text-[11px] font-medium">{material.students}</span>
          </div>
        </div>
        <Button variant="default">Ver grade curricular</Button>
      </div>
      <div className="mt-4 flex items-center gap-2 text-white-2/80 text-xs">
        <Wallet size={14} className="text-yellow" />
        <span>{material.discount}</span>
      </div>
    </div>
  </div>
);

// --- Main Component ---

export default function DashboardRoadmap() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const actions: Action[] = [
    {
      id: 1,
      text: "Aprofundar em React Hooks (Você errou 3 questões sobre useEffect)",
      priority: "high",
      material: {
        title: "React Completo: Do Zero ao Hooks Avançado",
        rating: 4.9,
        students: "12k alunos",
        image:
          "https://kinsta.com/pt/wp-content/uploads/sites/3/2023/04/react-must-be-in-scope-when-using-jsx-1024x512.jpg",
        discount: "Desconto de 20% exclusivo via nossa plataforma",
      },
    },
    {
      id: 2,
      text: "Aprofundar em Gerenciamento de Estado (Context API)",
      priority: "medium",
    },
    {
      id: 3,
      text: "Revisar conceitos de Closures em Javascript",
      priority: "low",
    },
    {
      id: 4,
      text: "Revisar conceitos de Closures em Javascript",
      priority: "low",
    },
  ];

  return (
    <div className="card bg-bg-2 flex flex-col gap-4 h-full ">
      <div className="flex justify-between">
        <h3 className="text-white-1 typ-h3">Plano de Ação Inteligente</h3>
        <Link to="/" className="link no-underline">
          Ver ultimo roadmap
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((action) => {
          const isExpanded = expandedId === action.id;

          return (
            <div
              key={action.id}
              className="flex flex-col border border-bg-3 rounded-sm bg-bg-1/40 hover:bg-bg-1/50 transition-colors p-4 cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : action.id)}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-white-1 flex-1 leading-snug">
                  {action.text}
                </p>
                <div className="flex items-center gap-3 shrink-0">
                  <PriorityBadge priority={action.priority} />
                </div>
              </div>

              {action.material && (
                <div className="flex flex-col mt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary-1">
                    Ver material sugerido
                    {isExpanded ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </div>
                  {isExpanded && (
                    <MaterialDropdown material={action.material} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
