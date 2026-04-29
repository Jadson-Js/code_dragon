import { Button } from "@/components/ui/button";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import {
  ArrowLeft,
  Clipboard,
  Facebook,
  Lightbulb,
  Linkedin,
  Twitter,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type QuizInsightPayload = {
  sessionQuizId: string;
  score: {
    user: number;
    community: number;
  };
  percentile: number;
  ranking: number;
  correctAnswers: number;
  wrongAnswers: number;
  ignoredAnswers: number;
  subjects: Array<{
    id: number;
    name: string;
    score: {
      user: number;
      community: number;
    };
  }>;
  stacks: Array<{
    id: number;
    name: string;
    score: {
      user: number;
      community: number;
    };
  }>;
  insights: {
    title: string;
    description: string;
    strongPoints: string[];
    weakPoints: string[];
  };
  roadmap: Array<{
    title: string;
    description: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
  }>;
};

const quizInsightsData: QuizInsightPayload = {
  sessionQuizId: "0835f1ef-4cde-42aa-9314-e742f866cdfb",
  score: {
    user: 50,
    community: 75,
  },
  percentile: 67,
  ranking: 2,
  correctAnswers: 1,
  wrongAnswers: 1,
  ignoredAnswers: 0,
  subjects: [
    {
      id: 8,
      name: "Arquitetura de Software e Design Patterns",
      score: {
        user: 50,
        community: 50,
      },
    },
  ],
  stacks: [
    {
      id: 3,
      name: "Node.js",
      score: {
        user: 50,
        community: 75,
      },
    },
  ],
  insights: {
    title: "Desempenho Mockado",
    description:
      "Esta é uma análise simulada para fins de teste. Seu desempenho foi analisado com sucesso.",
    strongPoints: ["Lógica de programação", "Conhecimento de sintaxe"],
    weakPoints: ["Arquitetura de sistemas", "Testes unitários"],
  },
  roadmap: [
    {
      title: "Estudar Padrões de Projeto",
      description: "Melhore a organização do seu código.",
      priority: "HIGH",
    },
    {
      title: "Praticar algoritmos",
      description: "Aumente sua velocidade de resolução de problemas.",
      priority: "MEDIUM",
    },
  ],
};

const priorityLabel: Record<"HIGH" | "MEDIUM" | "LOW", string> = {
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa",
};

export default function QuizInsights() {
  const navigate = useNavigate();
  const scoreProgress = quizInsightsData.score.user;

  const subjectComparisonData = quizInsightsData.subjects.map((subject) => ({
    subject: subject.name,
    voce: subject.score.user,
    media: subject.score.community,
    fullMark: 100,
  }));

  const technologyPerformanceData = quizInsightsData.stacks.map((stack) => ({
    tecnologia: stack.name,
    voce: stack.score.user,
    media: stack.score.community,
  }));

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            className="text-white-1 border border-bg-3 hover:bg-bg-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Voltar
          </Button>

          <Button className="uppercase tracking-wide font-semibold">
            Baixar relatório em PDF
          </Button>
        </div>

        <div>
          <h1 className="typ-h1 text-white-1">Resultado do Diagnóstico Técnico</h1>
          <p className="text-white-2 typ-caption mt-1">
            Análise completa do seu desempenho • Concluído em 16/01/2026
          </p>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <article className="card bg-bg-2 flex flex-col items-center justify-center text-center min-h-72">
            <p className="text-white-2 typ-caption mb-4">Nota Geral</p>
            <div
              className="w-34 h-34 rounded-full p-2 flex items-center justify-center"
              style={{
                background: `conic-gradient(#6366f1 ${scoreProgress}%, #334155 ${scoreProgress}% 100%)`,
              }}
            >
              <div className="w-full h-full rounded-full bg-bg-2 border border-bg-3 flex flex-col items-center justify-center">
                <span className="text-white-1 text-5xl font-bold leading-none">
                  {quizInsightsData.score.user}
                </span>
                <span className="text-white-2 typ-caption mt-1">/100</span>
              </div>
            </div>
            <p className="text-white-1 typ-h2 mt-4">Bom</p>
            <p className="text-white-2 typ-caption mt-1">
              Você fez {quizInsightsData.score.user}, média:{" "}
              {quizInsightsData.score.community}
            </p>
          </article>

          <article className="card bg-bg-2 min-h-72">
            <h2 className="typ-h3 text-white-1 mb-1">Seu Desempenho</h2>
            <p className="text-white-2 typ-caption">vs Média da Plataforma</p>

            <div className="mt-4 h-2 rounded-full bg-bg-1 border border-bg-3">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary-1 to-primary-2"
                style={{ width: `${scoreProgress}%` }}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 mt-5">
              <div className="border border-bg-3 rounded-lg p-3 bg-bg-1/50">
                <p className="text-white-2 typ-caption">Melhor que</p>
                <p className="text-primary-2 text-3xl font-bold">
                  {quizInsightsData.percentile}%
                </p>
                <p className="text-white-2 typ-caption">da comunidade</p>
              </div>
              <div className="border border-bg-3 rounded-lg p-3 bg-bg-1/50">
                <p className="text-white-2 typ-caption">Ranking</p>
                <p className="text-yellow text-3xl font-bold">
                  #{quizInsightsData.ranking}
                </p>
              </div>
            </div>
          </article>

          <article className="card bg-linear-to-br from-primary-1/20 to-primary-2/30 border-primary-2/40 min-h-72">
            <h2 className="typ-h3 text-white-1">Compartilhe seu resultado!</h2>
            <p className="text-white-2 typ-caption mt-1">
              Mostre suas habilidades para sua rede profissional
            </p>

            <div className="mt-4 rounded-lg border border-bg-3 bg-bg-1/70 p-3">
              <p className="text-white-1 typ-caption">
                🚀 Acabei de completar o Diagnóstico Técnico com{" "}
                {quizInsightsData.score.user}/100 pontos!
              </p>
              <p className="text-white-2 text-xs mt-3">
                https://plataforma.com/meu-resultado
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4">
              <button className="h-10 rounded-md bg-bg-1/70 border border-bg-3 flex items-center justify-center text-white-2 hover:text-white-1 transition-colors">
                <Twitter size={16} />
              </button>
              <button className="h-10 rounded-md bg-bg-1/70 border border-bg-3 flex items-center justify-center text-white-2 hover:text-white-1 transition-colors">
                <Linkedin size={16} />
              </button>
              <button className="h-10 rounded-md bg-bg-1/70 border border-bg-3 flex items-center justify-center text-white-2 hover:text-white-1 transition-colors">
                <Facebook size={16} />
              </button>
              <button className="h-10 rounded-md bg-bg-1/70 border border-bg-3 flex items-center justify-center text-white-2 hover:text-white-1 transition-colors">
                <Clipboard size={16} />
              </button>
            </div>
          </article>
        </section>

        <section className="card bg-bg-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-md bg-primary-1/20 text-primary-2 flex items-center justify-center">
              <Lightbulb size={16} />
            </span>
            <h2 className="typ-h3 text-white-1">Insight Personalizado</h2>
          </div>

          <div className="rounded-lg border border-bg-3 bg-bg-1/60 p-4 space-y-3">
            <h3 className="text-white-1 font-semibold">
              {quizInsightsData.insights.title}
            </h3>
            <p className="text-white-2 typ-caption">
              {quizInsightsData.insights.description}
            </p>
            <ul className="space-y-2 typ-caption">
              <li className="text-green">
                • Pontos Fortes: {quizInsightsData.insights.strongPoints.join(", ")}
              </li>
              <li className="text-red">
                • Áreas de Melhoria: {quizInsightsData.insights.weakPoints.join(", ")}
              </li>
              <li className="text-primary-2">• Próximos Passos: seguir o roadmap personalizado</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="rounded-lg border border-primary-2/30 bg-primary-1/10 p-3 text-center">
              <p className="text-primary-2 text-2xl font-bold">
                {quizInsightsData.correctAnswers}
              </p>
              <p className="text-white-2 typ-caption">Acertos</p>
            </div>
            <div className="rounded-lg border border-red/40 bg-red/10 p-3 text-center">
              <p className="text-red text-2xl font-bold">
                {quizInsightsData.wrongAnswers}
              </p>
              <p className="text-white-2 typ-caption">Erros</p>
            </div>
            <div className="rounded-lg border border-green/40 bg-green/10 p-3 text-center">
              <p className="text-green text-2xl font-bold">
                {quizInsightsData.ignoredAnswers}
              </p>
              <p className="text-white-2 typ-caption">Ignorados</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <article className="card bg-bg-2 min-h-92">
            <h2 className="typ-h3 text-white-1 mb-4">Comparativo nos assuntos</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={subjectComparisonData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip />
                  <Radar
                    name="Média"
                    dataKey="media"
                    stroke="#64748b"
                    fill="#64748b"
                    fillOpacity={0.2}
                  />
                  <Radar
                    name="Você"
                    dataKey="voce"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.35}
                  />
                  <Legend iconType="square" wrapperStyle={{ color: "#94a3b8" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="card bg-bg-2 min-h-92">
            <h2 className="typ-h3 text-white-1 mb-4">Desempenho por Tecnologia</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={technologyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="tecnologia"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Legend iconType="square" wrapperStyle={{ color: "#94a3b8" }} />
                  <Bar dataKey="media" name="Média" fill="#64748b" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="voce" name="Você" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="card bg-bg-2">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="typ-h2 text-white-1">Seu Roadmap Personalizado</h2>
              <p className="text-white-2 typ-caption">
                Plano de estudos baseado nos gaps identificados no diagnóstico
              </p>
            </div>
            <span className="px-3 py-1 rounded-full border border-bg-3 text-white-2 typ-caption">
              {quizInsightsData.roadmap.length} itens
            </span>
          </div>

          <div className="space-y-3">
            {quizInsightsData.roadmap.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-bg-3 bg-bg-1/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-white-1 typ-h3">{item.title}</h3>
                  <span className="px-3 py-1 rounded-full text-xs border border-red/40 bg-red/10 text-red">
                    {priorityLabel[item.priority]}
                  </span>
                </div>
                <p className="text-white-2 typ-caption mt-2">{item.description}</p>
                <button className="mt-3 text-primary-2 typ-caption hover:text-primary-1 transition-colors">
                  Ver material sugerido
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
