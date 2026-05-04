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
    <div className="bg-bg-2 border border-white-1/10 rounded-xl p-6 flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h3 className="text-white-1 text-lg font-semibold">
          Roadmap de Estudos
        </h3>
        <Link to="/" className="text-primary-1 text-sm hover:underline">
          Ver último roadmap
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((action) => {
          const isExpanded = expandedId === action.id;

          return (
            <div
              key={action.id}
              className="flex flex-col border border-bg-3 rounded-lg bg-bg-1/40 hover:bg-bg-1/50 transition-colors p-4 cursor-pointer"
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
          <div key={item.skill} className="flex items-center justify-between">
            <span className="text-sm text-white-2">{item.skill}</span>

            <div className="flex items-center gap-2 w-10/12">
              <div className="w-full bg-white/5 rounded-full h-2">
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
              <span className="text-sm text-white-1 w-10 text-right">
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
                  Pronto para acelerar sua carreira!
                </p>
              </div>
            </div>
            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Credits & Skills Section */}
              <div className="flex flex-col h-full gap-6">
                {/* Credits Panel */}
                <div className="bg-bg-2 border border-white-1/10 rounded-xl p-8 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="mb-4 text-white-1 text-xl font-semibold">
                      Créditos Disponíveis
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-mono text-[4rem] text-yellow leading-none">
                        5
                      </span>
                      <span className="font-mono text-[1.5rem] text-white-2">
                        /10
                      </span>
                    </div>
                    <p className="text-sm text-white-2 leading-relaxed">
                      Seus testes gratuitos renovam em 30 dias. <br />
                      Use-os para validar seu conhecimento em novas tecnologias.
                    </p>
                  </div>

                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-white-2 text-sm">
                        <BatteryWarning className="w-5 h-5 text-yellow" />
                        <span>Capacidade de Testes</span>
                      </div>
                      <span className="text-yellow font-mono text-sm font-bold">
                        50%
                      </span>
                    </div>
                    <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden flex">
                      {/* Progress Fill */}
                      <div
                        className="absolute top-0 left-0 h-full bg-yellow transition-all duration-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
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
                className="lg:col-span-2 bg-bg-2 rounded-xl p-8 relative overflow-hidden border-2 border-primary-1/50"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)",
                }}
              >
                <div
                  className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, var(--color-primary-1) 0%, transparent 70%)",
                  }}
                ></div>
                <div className="relative flex items-start gap-6 h-full flex-col">
                  <div className="flex items-start gap-6">
                    <div className="p-4 rounded-xl bg-primary-1/20 border border-primary-1">
                      <Rocket className="w-10 h-10 text-primary-1" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-2xl text-white-1 font-bold">
                        Quer acelerar sua contratação?
                      </h3>
                      <p className="mb-6 text-white-2">
                        Assinantes Pro têm{" "}
                        <span className="text-primary-1 font-semibold">
                          Testes Ilimitados
                        </span>{" "}
                        e acesso ao{" "}
                        <span className="text-primary-1 font-semibold">
                          Roadmap de Estudos
                        </span>{" "}
                        focado nas vagas atuais.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {[
                          "Testes técnicos ilimitados",
                          "Roadmap personalizado",
                          "Análise detalhada de erros",
                          "Simulações de entrevistas",
                        ].map((text) => (
                          <div key={text} className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-primary-1/20 text-primary-1">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm text-white-1 font-medium">
                              {text}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 mt-auto">
                        <button className="px-8 py-4 rounded-lg bg-primary-1 text-bg-1 font-bold shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] cursor-pointer">
                          Conhecer o Plano Pro
                        </button>
                        <div className="font-mono text-white-2">
                          <div className="text-[0.75rem]">A partir de</div>
                          <div className="text-[1.25rem] text-primary-1 font-bold">
                            R$ 24,90
                            <span className="text-[0.875rem]">/mês</span>
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
                    Iniciar Novo Diagnóstico
                  </h4>
                  <p className="text-sm text-white-2 leading-relaxed">
                    Teste suas habilidades técnicas e descubra seus gaps de
                    conhecimento
                  </p>
                </button>
                <button className="bg-bg-2 rounded-xl p-8 text-left transition-all border border-white-1/10 hover:border-green cursor-pointer">
                  <div className="inline-flex p-4 rounded-xl mb-4 bg-green/20">
                    <BookOpen className="w-8 h-8 text-green" />
                  </div>
                  <h4 className="mb-2 text-xl text-white-1 font-semibold">
                    Ver Roadmap
                  </h4>
                  <p className="text-sm text-white-2 leading-relaxed">
                    Acesse seu plano de estudos personalizado baseado nas vagas
                    atuais
                  </p>
                </button>
                <button className="bg-bg-2 rounded-xl p-8 text-left transition-all border border-white-1/10 hover:border-yellow cursor-pointer">
                  <div className="inline-flex p-4 rounded-xl mb-4 bg-yellow/20">
                    <BarChart3 className="w-8 h-8 text-yellow" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SkillsRadar />
                <DashboardRoadmap />
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
