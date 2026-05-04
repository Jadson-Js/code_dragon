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

      <button className="w-full bg-primary-1 hover:bg-primary-2 text-bg-1 px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 font-bold cursor-pointer">
        <TrendingUp className="w-4 h-4" />
        Fazer Novo Quiz (Node.js)
      </button>
    </div>
  );
}

export default function Dashboard() {
  const [section, setSection] = useState<"home" | "diagnostic">("home");
  const { data } = useAuthUser();

  const showSection = (s: "home" | "diagnostic") => {
    setSection(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <DashboardLayout>
      <main className="max-w-7xl mx-auto">
        {/* Home Section */}
        {section === "home" && (
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
                  className="bg-bg-2 rounded-xl p-8 text-left transition-all border-2 border-primary-1 hover:translate-y-[-4px] hover:border-primary-1/50 cursor-pointer"
                  onClick={() => showSection("diagnostic")}
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
                <button className="bg-bg-2 rounded-xl p-8 text-left transition-all border border-white-1/10 hover:translate-y-[-4px] hover:border-green cursor-pointer">
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
                <button className="bg-bg-2 rounded-xl p-8 text-left transition-all border border-white-1/10 hover:translate-y-[-4px] hover:border-yellow cursor-pointer">
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
        )}

        {/* Diagnostic Section */}
        {section === "diagnostic" && (
          <section
            id="diagnostic-section"
            className="space-y-12 pb-32 animate-in slide-in-from-bottom-4 duration-500"
          >
            {/* Back to Home */}
            <button
              onClick={() => showSection("home")}
              className="text-white-2 hover:text-white-1 transition-colors flex items-center gap-2 cursor-pointer"
            >
              ← Voltar ao Início
            </button>

            {/* Score Section */}
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div
                  className="w-48 h-48 rounded-full flex items-center justify-center border-4 border-yellow"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)",
                  }}
                >
                  <div className="text-center">
                    <div className="font-mono text-[3.5rem] text-yellow leading-none">
                      55
                    </div>
                    <div className="font-mono text-[1.5rem] text-white-2">
                      /100
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-3 px-6 py-3 rounded-lg bg-yellow/10 border border-yellow">
                <AlertTriangle className="w-5 h-5 text-yellow" />
                <span className="text-yellow font-medium">
                  Atenção: Nível de Empregabilidade Baixo
                </span>
              </div>
              <div className="mt-4 text-center text-white-2">
                <p>Você está abaixo da média do mercado</p>
                <p className="mt-1 font-mono text-sm">
                  Top 78% • Necessita melhoria crítica
                </p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart */}
              <div className="bg-bg-2 border border-white-1/10 rounded-xl p-6">
                <h3 className="mb-2 text-white-1">Radar de Empregabilidade</h3>
                <p className="mb-6 text-sm text-white-2">
                  Comparativo: Seu nível vs. Exigência do mercado
                </p>
                <div className="flex justify-center py-4">
                  <svg viewBox="0 0 400 400" className="w-full max-w-[350px]">
                    <polygon
                      points="200,40 340,120 340,280 200,360 60,280 60,120"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    <polygon
                      points="200,80 305,140 305,260 200,320 95,260 95,140"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    <polygon
                      points="200,120 270,160 270,240 200,280 130,240 130,160"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    <polygon
                      points="200,160 235,180 235,220 200,240 165,220 165,180"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    <line
                      x1="200"
                      y1="200"
                      x2="200"
                      y2="40"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <line
                      x1="200"
                      y1="200"
                      x2="340"
                      y2="120"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <line
                      x1="200"
                      y1="200"
                      x2="340"
                      y2="280"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <line
                      x1="200"
                      y1="200"
                      x2="200"
                      y2="360"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <line
                      x1="200"
                      y1="200"
                      x2="60"
                      y2="280"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <line
                      x1="200"
                      y1="200"
                      x2="60"
                      y2="120"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <polygon
                      points="200,60 310,140 310,260 200,320 80,260 80,140"
                      fill="rgba(148, 163, 184, 0.2)"
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                    <polygon
                      points="200,128 270,168 256,232 200,264 130,232 158,168"
                      fill="rgba(245, 158, 11, 0.3)"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    <text
                      x="200"
                      y="30"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="12"
                    >
                      Arquitetura
                    </text>
                    <text
                      x="350"
                      y="120"
                      textAnchor="start"
                      fill="#94a3b8"
                      fontSize="12"
                    >
                      Lógica
                    </text>
                    <text
                      x="350"
                      y="290"
                      textAnchor="start"
                      fill="#94a3b8"
                      fontSize="12"
                    >
                      Frameworks
                    </text>
                    <text
                      x="200"
                      y="380"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="12"
                    >
                      DevOps
                    </text>
                    <text
                      x="50"
                      y="290"
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="12"
                    >
                      Design Patterns
                    </text>
                    <text
                      x="50"
                      y="120"
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="12"
                    >
                      Testes
                    </text>
                  </svg>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white-2"></div>
                    <span className="text-xs text-white-2">Mercado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow"></div>
                    <span className="text-xs text-white-2">Você</span>
                  </div>
                </div>
              </div>

              {/* Bell Curve Chart */}
              <div className="bg-bg-2 border border-white-1/10 rounded-xl p-6">
                <h3 className="mb-2 text-white-1">Sua Posição na Fila</h3>
                <p className="mb-6 text-sm text-white-2">
                  Comparativo com outros candidatos
                </p>
                <div className="flex justify-center py-4">
                  <svg viewBox="0 0 400 200" className="w-full max-w-[350px]">
                    <path
                      d="M 0,190 Q 50,190 100,150 Q 150,110 200,40 Q 250,110 300,150 Q 350,190 400,190"
                      fill="rgba(148, 163, 184, 0.1)"
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                    <path
                      d="M 312,160 Q 350,190 400,190 L 400,200 L 312,200 Z"
                      fill="rgba(99, 102, 241, 0.2)"
                    />
                    <circle
                      cx="312"
                      cy="160"
                      r="6"
                      fill="#f59e0b"
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                    <text
                      x="312"
                      y="145"
                      textAnchor="middle"
                      fill="#f59e0b"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      VOCÊ
                    </text>
                    <line
                      x1="0"
                      y1="190"
                      x2="400"
                      y2="190"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <text
                      x="0"
                      y="205"
                      textAnchor="start"
                      fill="#94a3b8"
                      fontSize="9"
                    >
                      0%
                    </text>
                    <text
                      x="200"
                      y="205"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="9"
                    >
                      50%
                    </text>
                    <text
                      x="400"
                      y="205"
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="9"
                    >
                      100%
                    </text>
                  </svg>
                </div>
                <div className="mt-6 p-4 rounded-lg bg-yellow/10 border border-yellow">
                  <p className="text-yellow text-sm">
                    Você está no <span className="font-mono">Top 78%</span>.
                    Para entrar no Top 10%, você precisa melhorar
                    significativamente.
                  </p>
                </div>
              </div>
            </div>

            {/* Gaps List */}
            <div className="bg-bg-2 border border-white-1/10 rounded-xl p-6">
              <h3 className="mb-6 text-white-1">
                Análise por Área de Conhecimento
              </h3>
              <div className="space-y-4">
                <div className="rounded-lg p-5 bg-bg-1 border border-white-1/10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-yellow" />
                      <div>
                        <h4 className="text-white-1 font-semibold">
                          Lógica de Programação
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-sm text-yellow">
                            60/100
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-white-2">
                    Você acertou 6 de 10 questões. Principais erros em recursão
                    e complexidade algorítmica.
                  </p>
                </div>
                <div className="rounded-lg p-5 bg-white/5 border border-white-1/10 relative overflow-hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-6 h-6 text-yellow" />
                      <div>
                        <h4 className="text-white-2 font-semibold">
                          Arquitetura de Software
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-sm text-yellow">
                            45/100
                          </span>
                          <span className="flex items-center gap-1 text-[0.75rem] text-primary-1">
                            <Lock className="w-3 h-3" /> Pro
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-white-2 blur-sm select-none">
                    Identificamos falhas críticas em padrões de design e
                    arquitetura escalável. Recomendamos estudo em Clean
                    Architecture e SOLID.
                  </p>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="px-6 py-3 rounded-lg border-2 border-primary-1 text-primary-1 font-semibold transition-all hover:bg-primary-1 hover:text-bg-1 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] cursor-pointer">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Desbloquear Análise
                    </button>
                  </div>
                </div>
              </div>

              {/* Global CTA */}
              <div
                className="mt-8 p-8 rounded-xl text-center border-2 border-primary-1"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)",
                }}
              >
                <Lock className="w-8 h-8 mx-auto mb-4 text-primary-1" />
                <h4 className="text-xl text-white-1 mb-2 font-semibold">
                  Identificamos 3 falhas críticas no seu conhecimento
                </h4>
                <p className="text-sm text-white-2 mb-6">
                  Seu perfil reprovaria na triagem de 78% das vagas atuais
                </p>
                <button className="px-8 py-4 rounded-lg bg-primary-1 text-bg-1 font-bold shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:scale-105 cursor-pointer">
                  Gerar Roadmap de Correção
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Sticky Footer Banner */}
        {section === "diagnostic" && (
          <div
            id="sticky-banner"
            className="fixed bottom-0 left-64 right-0 p-6 z-50 bg-gradient-to-t from-bg-1 via-bg-1/90 to-transparent border-t border-primary-1/30"
          >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-xl bg-bg-2 border-2 border-primary-1 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="p-3 rounded-lg bg-primary-1/20">
                  <TrendingUp className="w-7 h-7 text-primary-1" />
                </div>
                <div>
                  <h4 className="text-white-1 font-semibold">
                    Não corra o risco de falhar na sua próxima entrevista
                    técnica
                  </h4>
                  <p className="text-sm text-white-2 mt-1">
                    Libere seu Roadmap personalizado, análise detalhada e
                    simulações de entrevista
                  </p>
                </div>
              </div>
              <button className="w-full md:w-auto px-8 py-4 rounded-lg bg-primary-1 text-bg-1 font-bold flex items-center justify-center gap-3 transition-all hover:-translate-y-1 cursor-pointer">
                <Lock className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-base leading-tight">Tornar-se Pro</div>
                  <div className="text-[0.75rem] opacity-90 font-mono">
                    R$ 24,90/mês
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
