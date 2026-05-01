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
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { QuizReportPDF } from "./QuizReportPDF";
import { Loader2 } from "lucide-react";
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

const priorityLabel: Record<"HIGH" | "MEDIUM" | "LOW", string> = {
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa",
};

const priorityStyles: Record<"HIGH" | "MEDIUM" | "LOW", string> = {
  HIGH: "border-red/40 bg-red/10 text-red",
  MEDIUM: "border-yellow/40 bg-yellow/10 text-yellow",
  LOW: "border-green/40 bg-green/10 text-green",
};

export default function QuizInsights() {
  const navigate = useNavigate();
  const location = useLocation();
  const insightsDataFromState = location.state
    ?.insightsData as QuizInsightPayload;

  const [isDownloading, setIsDownloading] = useState(false);

  const data = insightsDataFromState;
  const scoreProgress = data.score.user;

  const subjectComparisonData = data.subjects.map((subject) => ({
    subject: subject.name,
    voce: subject.score.user,
    media: subject.score.community,
    fullMark: 100,
  }));

  const technologyPerformanceData = data.stacks.map((stack) => ({
    tecnologia: stack.name,
    voce: stack.score.user,
    media: stack.score.community,
  }));

  const handleDownloadPDF = async () => {
    if (!data) return;
    setIsDownloading(true);
    try {
      const blob = await pdf(<QuizReportPDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Relatorio_CodeDragon_${data.sessionQuizId.slice(0, 8)}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" className="" onClick={() => navigate("/")}>
            <ArrowLeft size={16} />
            Voltar
          </Button>

          <Button
            className="uppercase tracking-wide font-semibold"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Gerando...
              </>
            ) : (
              "Baixar relatório em PDF"
            )}
          </Button>
        </div>

        <div>
          <h1 className="typ-h1 text-white-1">
            Resultado do Diagnóstico Técnico
          </h1>
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
                  {data.score.user}
                </span>
                <span className="text-white-2 typ-caption mt-1">/100</span>
              </div>
            </div>
            <p className="text-white-1 typ-h2 mt-4">Bom</p>
            <p className="text-white-2 typ-caption mt-1">
              Você fez {data.score.user}, média: {data.score.community}
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
                  {data.percentile}%
                </p>
                <p className="text-white-2 typ-caption">da comunidade</p>
              </div>
              <div className="border border-bg-3 rounded-lg p-3 bg-bg-1/50">
                <p className="text-white-2 typ-caption">Ranking</p>
                <p className="text-yellow text-3xl font-bold">
                  #{data.ranking}
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
                {data.score.user}/100 pontos!
              </p>
              <p className="text-white-2 text-xs mt-3">
                https://plataforma.com/meu-resultado
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4">
              <button className="h-10 rounded-md bg-bg-1/70 border border-bg-3 flex items-center justify-center text-white-2 hover:text-white-1 transition-colors cursor-pointer">
                <Twitter size={16} />
              </button>
              <button className="h-10 rounded-md bg-bg-1/70 border border-bg-3 flex items-center justify-center text-white-2 hover:text-white-1 transition-colors cursor-pointer">
                <Linkedin size={16} />
              </button>
              <button className="h-10 rounded-md bg-bg-1/70 border border-bg-3 flex items-center justify-center text-white-2 hover:text-white-1 transition-colors cursor-pointer">
                <Facebook size={16} />
              </button>
              <button className="h-10 rounded-md bg-bg-1/70 border border-bg-3 flex items-center justify-center text-white-2 hover:text-white-1 transition-colors cursor-pointer">
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
              {data.insights.title}
            </h3>
            <p className="text-white-2 typ-caption">
              {data.insights.description}
            </p>
            <ul className="space-y-2 typ-caption">
              <li className="text-green">
                • Pontos Fortes: {data.insights.strongPoints.join(", ")}
              </li>
              <li className="text-red">
                • Áreas de Melhoria: {data.insights.weakPoints.join(", ")}
              </li>
              <li className="text-primary-2">
                • Próximos Passos: seguir o roadmap personalizado
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="rounded-lg border border-primary-2/30 bg-primary-1/10 p-3 text-center">
              <p className="text-primary-2 text-2xl font-bold">
                {data.correctAnswers}
              </p>
              <p className="text-white-2 typ-caption">Acertos</p>
            </div>
            <div className="rounded-lg border border-red/40 bg-red/10 p-3 text-center">
              <p className="text-red text-2xl font-bold">{data.wrongAnswers}</p>
              <p className="text-white-2 typ-caption">Erros</p>
            </div>
            <div className="rounded-lg border border-green/40 bg-green/10 p-3 text-center">
              <p className="text-green text-2xl font-bold">
                {data.ignoredAnswers}
              </p>
              <p className="text-white-2 typ-caption">Ignorados</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <article className="card bg-bg-2 min-h-92">
            <h2 className="typ-h3 text-white-1 mb-4">
              Comparativo nos assuntos
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {subjectComparisonData.length < 3 ? (
                  <BarChart data={subjectComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="subject"
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
                    <Tooltip cursor={false} />
                    <Legend
                      iconType="square"
                      wrapperStyle={{ color: "#94a3b8" }}
                    />
                    <Bar
                      dataKey="media"
                      name="Média"
                      fill="#64748b"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="voce"
                      name="Você"
                      fill="#6366f1"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                ) : (
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
                    <Legend
                      iconType="square"
                      wrapperStyle={{ color: "#94a3b8" }}
                    />
                  </RadarChart>
                )}
              </ResponsiveContainer>
            </div>
          </article>

          <article className="card bg-bg-2 min-h-92">
            <h2 className="typ-h3 text-white-1 mb-4">
              Desempenho por Tecnologia
            </h2>
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
                  <Tooltip cursor={false} />
                  <Legend
                    iconType="square"
                    wrapperStyle={{ color: "#94a3b8" }}
                  />
                  <Bar
                    dataKey="media"
                    name="Média"
                    fill="#64748b"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="voce"
                    name="Você"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
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
              {data.roadmap.length} itens
            </span>
          </div>

          <div className="space-y-3">
            {data.roadmap.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-bg-3 bg-bg-1/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-white-1 typ-h3">{item.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs border ${priorityStyles[item.priority]}`}
                  >
                    {priorityLabel[item.priority]}
                  </span>
                </div>
                <p className="text-white-2 typ-caption mt-2">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
