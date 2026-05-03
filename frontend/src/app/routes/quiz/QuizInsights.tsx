import { Button } from "@/components/ui/button";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import QuizInsightsModal from "@/features/quiz/components/QuizInsightsModal";
import { ArrowLeft, Gift, Lightbulb, Share2, UserPlus } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useState } from "react";
import { useQuizReport } from "@/features/quiz/hooks/useQuizReport";
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
import type { QuizInsightPayload } from "@/features/quiz/types/quiz-report.types";
import { useOptionalAuthUser } from "@/features/auth/hooks/useOptionalAuthUser";
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
  const { quiz_session_id } = useParams();
  const location = useLocation();
  const insightsDataFromState = location.state
    ?.insightsData as QuizInsightPayload;

  const { data: userData, isPending: isAuthPending } = useOptionalAuthUser();

  const { data: insightsDataFromApi, isLoading: isReportLoading } =
    useQuizReport(!insightsDataFromState ? quiz_session_id : undefined);

  const isLoading = isAuthPending || isReportLoading;

  const [isDownloading, setIsDownloading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const data = insightsDataFromState || insightsDataFromApi;

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

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

  if (isLoading) {
    const loader = (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary-2" />
        <p className="text-white-2 animate-pulse">Carregando resultados...</p>
      </div>
    );
    return userData ? (
      <DashboardLayout>{loader}</DashboardLayout>
    ) : (
      <div className="min-h-screen bg-bg-1 p-8">{loader}</div>
    );
  }

  if (!data) {
    const notFound = (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <h2 className="text-white-1 typ-h2">Resultado não encontrado</h2>
        <p className="text-white-2">
          Não conseguimos localizar os dados deste diagnóstico.
        </p>
        <Button onClick={() => navigate("/")}>Voltar ao Início</Button>
      </div>
    );
    return userData ? (
      <DashboardLayout>{notFound}</DashboardLayout>
    ) : (
      <div className="min-h-screen bg-bg-1 p-8">{notFound}</div>
    );
  }

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

  const content = (
    <div className="max-w-7xl mx-auto space-y-4">
      {!userData && (
        <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary-1/20 via-primary-2/10 to-transparent border border-primary-2/20 p-6 mb-8">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary-2 font-bold uppercase tracking-wider text-xs">
                <span className="flex h-2 w-2 rounded-full bg-primary-2 animate-pulse" />
                Desbloqueie seu potencial
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white-1">
                Gostou do diagnóstico? Crie o seu agora!
              </h2>
              <p className="text-white-2 max-w-xl">
                Junte-se a milhares de desenvolvedores que já estão mapeando
                seus gaps técnicos e recebendo roadmaps personalizados para
                acelerar a carreira.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                size="lg"
                className="bg-primary-2 hover:bg-primary-2/90 text-white font-bold px-8 h-12 shadow-lg shadow-primary-2/20 cursor-pointer"
                onClick={() => navigate("/auth/signup")}
              >
                <UserPlus size={18} className="mr-2" />
                CRIAR MINHA CONTA
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white-2/20 text-white-2 hover:text-white-1 h-12 cursor-pointer"
                onClick={() => navigate("/auth/login")}
              >
                Já tenho conta
              </Button>
            </div>
          </div>
          {/* Decorative background elements */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-2/10 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        </section>
      )}

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
              background: `conic-gradient(#6366f1 ${data.score.user}%, #334155 ${data.score.user}% 100%)`,
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
              style={{ width: `${data.score.user}%` }}
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
              <p className="text-yellow text-3xl font-bold">#{data.ranking}</p>
            </div>
          </div>
        </article>

        <article className="relative overflow-hidden rounded-2xl border border-primary-2/40 bg-linear-to-br from-[#1a1040] via-[#2d1b69] to-[#1a2a50] p-6 flex flex-col justify-center">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/10" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-blue-500/10" />

          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-md bg-primary-1/20 text-primary-2 flex items-center justify-center">
              <Share2 size={16} />
            </span>
            <h2 className="typ-h3 text-white-1">Compartilhe seu resultado!</h2>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-purple-200/80">
            Recrutadores procuram devs que demonstram crescimento. Compartilhar
            seu diagnóstico é prova pública de que você investe em si mesmo.
          </p>

          <div className="mt-3 flex items-start gap-3 rounded-xl border border-yellow-400/20 bg-yellow-400/8 px-3.5 py-3">
            <Gift size={18} className="mt-0.5 flex-shrink-0 text-yellow-300" />
            <div>
              <p className="text-sm font-medium text-yellow-300">
                Ganhe +1 quiz por mês, para sempre!!!
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-yellow-300/60">
                Cada pessoa que se cadastrar pelo seu link te dá um quiz extra
                vitalício.
              </p>
            </div>
          </div>

          <Button
            className="w-full mt-6 h-12 uppercase font-bold tracking-wide cursor-pointer"
            onClick={handleShare}
          >
            <Share2 size={18} className="mr-2" />
            Compartilhar agora
          </Button>

          <p className="mt-4 text-center text-[11px] text-gray-400">
            Mais de 2.400 devs já compartilharam
          </p>
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
          <h3 className="text-white-1 font-semibold">{data.insights.title}</h3>
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
          <h2 className="typ-h3 text-white-1 mb-4">Comparativo nos assuntos</h2>
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
                <Legend iconType="square" wrapperStyle={{ color: "#94a3b8" }} />
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

      {!userData && (
        <section className="card bg-linear-to-br from-bg-2 to-bg-3 border-primary-2/30 text-center py-12 px-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-2/20 text-primary-2 mb-2">
              <UserPlus size={32} />
            </div>
            <h2 className="typ-h1 text-white-1">
              Pronto para levar sua carreira ao próximo nível?
            </h2>
            <p className="text-white-2 text-lg">
              Crie sua conta gratuita agora e tenha acesso a diagnósticos
              ilimitados, acompanhamento de evolução e muito mais.
            </p>
            <Button
              size="lg"
              className="bg-primary-2 hover:bg-primary-2/90 text-white font-bold px-12 h-14 text-lg cursor-pointer"
              onClick={() => navigate("/auth/signup")}
            >
              COMEÇAR AGORA — É GRÁTIS
            </Button>
            <p className="text-white-2 typ-caption">
              Leva menos de 30 segundos para se cadastrar.
            </p>
          </div>
        </section>
      )}

      <QuizInsightsModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={data}
      />
    </div>
  );

  return userData ? (
    <DashboardLayout>{content}</DashboardLayout>
  ) : (
    <div className="min-h-screen bg-bg-1 flex flex-col">
      <header className="w-full py-6 px-8 border-b border-bg-3 bg-bg-1/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src="/logo.svg" alt="CodeDragon" className="h-8" />
          </div>
        </div>
      </header>
      <main className="flex-1 p-8">{content}</main>
      <footer className="w-full py-8 px-8 border-t border-bg-3 bg-bg-2/30 text-center">
        <p className="text-white-2 typ-caption">
          © {new Date().getFullYear()} CodeDragon. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
