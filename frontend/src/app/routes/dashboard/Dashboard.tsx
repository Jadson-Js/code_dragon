import { useState } from "react";
import {
  BatteryWarning,
  Rocket,
  Check,
  Play,
  BookOpen,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lock,
  TrendingUp,
  AlertCircle,
  Brain,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
  Wallet,
  Sparkles,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import QuizConfigModal from "@/features/dashboard/components/QuizConfigModal";

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
  description: string;
  priority: "high" | "medium" | "low";
  material?: Material;
}

// --- Roadmap Components ---

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
  <div className="   flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
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
        <Button variant="default" size="sm">
          Ver grade curricular
        </Button>
      </div>
      <div className="mt-4 flex items-center gap-2 text-white-2/80 text-xs">
        <Wallet size={14} className="text-yellow" />
        <span>{material.discount}</span>
      </div>
    </div>
  </div>
);

function DashboardRoadmap() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const actions: Action[] = [
    {
      id: 1,
      text: "Dominar React Server Components",
      description:
        "Aprenda a arquitetura moderna do Next.js para melhorar a performance e o SEO das suas aplicações.",
      priority: "high",
      material: {
        title: "Mastering RSC & Next.js 15",
        rating: 4.9,
        students: "12k",
        image: "https://placehold.co/100x100/1e293b/white?text=RSC",
        discount: "15% OFF",
      },
    },
    {
      id: 2,
      text: "Aprofundar em Generics no TypeScript",
      description:
        "Crie componentes e funções reutilizáveis e tipadas de forma avançada para reduzir bugs em produção.",
      priority: "medium",
      material: {
        title: "TypeScript Advanced Patterns",
        rating: 4.8,
        students: "8k",
        image: "https://placehold.co/100x100/1e293b/white?text=TS",
        discount: "Gratuito",
      },
    },
    {
      id: 3,
      text: "Configurar CI/CD com GitHub Actions",
      description:
        "Automatize seus testes e deploys para garantir uma entrega contínua e segura do seu código.",
      priority: "low",
    },
  ];

  return (
    <div className="bg-bg-2 border border-white-1/10 rounded-xl p-6 flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h3 className="text-white-1 text-lg font-semibold">
          Roadmap de Estudos
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((action) => {
          const isExpanded = expandedId === action.id;

          return (
            <div
              key={action.id}
              className={cn(
                "flex flex-col p-4 rounded-xl border border-white-1/5 bg-white-1/5  transition-all  ",
                isExpanded &&
                  "ring-1 ring-primary-1/40 border-primary-1/20 bg-white-1/10",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white-1 transition-colors">
                    {action.text}
                  </h4>
                  <p className="text-xs text-white-2 mt-1 opacity-70 leading-relaxed line-clamp-2">
                    {action.description}
                  </p>
                </div>
                <PriorityBadge priority={action.priority} />
              </div>

              {action.material && (
                <div className="mt-4">
                  <div className="flex items-center justify-start gap-1 group cursor-pointer">
                    <span
                      onClick={() =>
                        setExpandedId(isExpanded ? null : action.id)
                      }
                      className="text-xs text-primary-1 group-hover:text-primary-2 transition-colors "
                    >
                      Ver material sugerido
                    </span>

                    <ChevronDown
                      size={14}
                      className={cn(
                        "text-primary-1 transition-transform duration-300 group-hover:text-primary-2",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white-1/5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <MaterialDropdown material={action.material} />
                    </div>
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

function SkillsRadar() {
  const data = [
    { skill: "React", value: 85 },
    { skill: "TypeScript", value: 60 },
    { skill: "Node.js", value: 40 },
    { skill: "SQL", value: 70 },
    { skill: "Git", value: 75 },
  ];

  return (
    <div className="bg-bg-2 rounded-xl p-6 shadow-sm border border-white-1/10 flex flex-col h-full">
      <h3 className="text-white-1 mb-4 font-semibold">Meu Radar Técnico</h3>

      <div className="mb-6 flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <Radar
              name="Skills"
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 mb-5">
        {data.map((item) => (
          <div key={item.skill} className="flex items-center gap-4">
            <span
              className="text-sm text-white-2 truncate flex-1"
              title={item.skill}
            >
              {item.skill}
            </span>

            <div className="flex items-center gap-2 flex-3">
              <div className="flex-1 bg-white/5 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.value >= 70
                      ? "bg-green"
                      : item.value >= 50
                        ? "bg-primary-1"
                        : "bg-yellow"
                  }`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <span className="text-sm text-white-1 w-10 text-right shrink-0">
                {item.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const { data } = useAuthUser();

  return (
    <DashboardLayout>
      <main className="max-w-7xl mx-auto">
        {/* Home Section */}
        <section
          id="home-section"
          className="space-y-12 animate-in fade-in duration-500"
        >
          {/* Welcome */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[28px] text-white-1 font-semibold">
                  Olá, {data?.name || "Pedro"}.
                </h2>
                <span className="px-3 py-1 rounded-full bg-bg-2 border border-white-1/10 text-white-2 text-xs">
                  Plano Free
                </span>
              </div>
              <p className="mt-2 text-white-2">
                Bom ter você por aqui para testar as primeiras funcionalidades!
              </p>
            </div>
          </div>
          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Credits & Skills Section */}
            <div className="flex flex-col h-full gap-6">
              {/* Credits Panel */}
              <div
                className="relative bg-bg-2 border-2 border-white-1/10 rounded-xl p-8 h-full flex flex-col justify-between opacity-70 cursor-not-allowed overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(148, 163, 184, 0.05) 100%)",
                }}
              >
                <div className="absolute top-4 right-4 px-3 py-1 bg-white-1/10 rounded-full text-[10px] font-bold text-white-2 uppercase tracking-widest border border-white-1/10">
                  Em Breve
                </div>
                <div>
                  <h3 className="mb-4 text-white-1 text-xl font-semibold">
                    Créditos Disponíveis
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-mono text-[4rem] text-white-1 leading-none">
                      5
                    </span>
                    <span className="font-mono text-[1.5rem] text-white-2">
                      /10
                    </span>
                  </div>
                  <p className="text-sm text-white-2 leading-relaxed">
                    Como estamos no início, você tem alguns testes para experimentar. <br />
                    Use-os para testar seus conhecimentos e me dar um feedback!
                  </p>
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-white-2 text-sm">
                      <BatteryWarning className="w-5 h-5 text-white-2" />
                      <span>Capacidade de Testes</span>
                    </div>
                    <span className="text-white-2 font-mono text-sm font-bold">
                      50%
                    </span>
                  </div>
                  <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden flex">
                    {/* Progress Fill */}
                    <div
                      className="absolute top-0 left-0 h-full bg-white-1/20 transition-all duration-500"
                      style={{ width: "50%" }}
                    />
                    {/* Masks to create fragments */}
                    <div className="absolute inset-0 flex w-full h-full pointer-events-none">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex-1 border-r-4 border-bg-2 last:border-none"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Banner */}
            <div
              className="lg:col-span-2 bg-bg-2 rounded-xl p-8 relative overflow-hidden border-2 border-white-1/10 opacity-70 cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(148, 163, 184, 0.05) 100%)",
              }}
            >
              <div className="absolute top-4 right-4 px-3 py-1 bg-white-1/10 rounded-full text-[10px] font-bold text-white-2 uppercase tracking-widest border border-white-1/10">
                Em Breve
              </div>
              <div
                className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, var(--color-white-2) 0%, transparent 70%)",
                }}
              ></div>
              <div className="relative flex items-start gap-6 h-full flex-col">
                <div className="flex items-start gap-6">
                  <div className="p-4 rounded-xl bg-white-1/5 border border-white-1/10 grayscale">
                    <Rocket className="w-10 h-10 text-white-2" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-2xl text-white-1 font-bold">
                      O que vem por aí no Code Dragon
                    </h3>
                    <p className="mb-6 text-white-2">
                      Estou trabalhando em novas funcionalidades para te ajudar a evoluir ainda mais rápido.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {[
                        "Testes técnicos ilimitados",
                        "Roadmap personalizado",
                        "Análise detalhada de erros",
                        "Simulações de entrevistas",
                      ].map((text) => (
                        <div key={text} className="flex items-center gap-2">
                          <div className="p-1 rounded-full bg-white-1/10 text-white-2">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm text-white-2 font-medium">
                            {text}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 mt-auto">
                      <button className="px-8 py-4 rounded-lg bg-white-1/10 text-white-2 font-bold cursor-not-allowed border border-white-1/10">
                        Em Desenvolvimento
                      </button>
                      <div className="font-mono text-white-2 opacity-50">
                        <div className="text-[0.75rem]">Previsão</div>
                        <div className="text-[1.25rem] text-white-1 font-bold">
                          R$ --,--
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="mb-6 text-2xl text-white-1">Ações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                className="bg-bg-2 rounded-xl p-8 text-left transition-all border border-white-1/10 hover:border-primary-1 cursor-pointer"
                onClick={() => setIsQuizModalOpen(true)}
              >
                <div className="inline-flex p-4 rounded-xl mb-4 bg-primary-1/20">
                  <Play className="w-8 h-8 text-primary-1" />
                </div>
                <h4 className="mb-2 text-xl text-white-1 font-semibold">
                  Iniciar Novo Quiz
                </h4>
                <p className="text-sm text-white-2 leading-relaxed">
                  Teste suas habilidades técnicas e descubra seus gaps de
                  conhecimento
                </p>
              </button>
              <button className="relative bg-bg-2 rounded-xl p-8 text-left transition-all border border-white-1/10 opacity-60 cursor-not-allowed overflow-hidden group">
                <div className="absolute top-4 right-4 px-2 py-1 bg-white-1/10 rounded text-[10px] font-bold text-white-2 uppercase tracking-widest border border-white-1/10">
                  Em Breve
                </div>
                <div className="inline-flex p-4 rounded-xl mb-4 bg-white-1/5 grayscale">
                  <BookOpen className="w-8 h-8 text-white-2" />
                </div>
                <h4 className="mb-2 text-xl text-white-1 font-semibold">
                  Ver Roadmap
                </h4>
                <p className="text-sm text-white-2 leading-relaxed">
                  Acesse seu plano de estudos baseado no seu desempenho nos quizzes
                </p>
              </button>
              <button className="relative bg-bg-2 rounded-xl p-8 text-left transition-all border border-white-1/10 opacity-60 cursor-not-allowed overflow-hidden group">
                <div className="absolute top-4 right-4 px-2 py-1 bg-white-1/10 rounded text-[10px] font-bold text-white-2 uppercase tracking-widest border border-white-1/10">
                  Em Breve
                </div>
                <div className="inline-flex p-4 rounded-xl mb-4 bg-white-1/5 grayscale">
                  <BarChart3 className="w-8 h-8 text-white-2" />
                </div>
                <h4 className="mb-2 text-xl text-white-1 font-semibold">
                  Minha Evolução
                </h4>
                <p className="text-sm text-white-2 leading-relaxed">
                  Acompanhe seu progresso e veja como você está evoluindo ao
                  longo do tempo
                </p>
              </button>
            </div>
          </div>

          <div className="">
            <h3 className="mb-6 text-2xl text-white-1">Estatísticas</h3>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1">
                <SkillsRadar />
              </div>
              <div className="col-span-2">
                <DashboardRoadmap />
              </div>
            </div>
          </div>
        </section>

        <QuizConfigModal
          open={isQuizModalOpen}
          onOpenChange={setIsQuizModalOpen}
        />
      </main>
    </DashboardLayout>
  );
}
