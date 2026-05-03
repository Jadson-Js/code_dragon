import type { QuizInsightPayload } from "@/features/quiz/types/quiz-report.types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// v1.2 - Premium Shared Report Design
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#0f172a", // Deep Navy
    color: "#f8fafc",
    fontFamily: "Helvetica",
  },
  // Background decoration
  bgCircle: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(99, 102, 241, 0.05)",
  },
  container: {
    padding: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandIcon: {
    width: 32,
    height: 32,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1.5,
    color: "#fff",
  },
  badge: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    padding: "4 12",
    borderRadius: 20,
    border: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  badgeText: {
    fontSize: 9,
    color: "#818cf8",
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  // Hero Section
  hero: {
    marginBottom: 40,
    alignItems: "center",
  },
  mainScoreContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    border: 8,
    borderColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
    marginBottom: 20,
    position: "relative",
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#6366f1",
  },
  scoreLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: -5,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#fff",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    maxWidth: 400,
    marginHorizontal: "auto",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1e293b",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: "center",
    border: 1,
    borderColor: "#f5f5f5",
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 9,
    color: "#94a3b8",
    marginTop: 4,
    textTransform: "uppercase",
  },

  // Content Columns
  contentRow: {
    flexDirection: "row",
    gap: 30,
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#818cf8",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Technical Breakdown
  skillItem: {
    marginBottom: 15,
  },
  skillInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  skillName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#f1f5f9",
  },
  skillPercent: {
    fontSize: 11,
    color: "#6366f1",
    fontWeight: "bold",
  },
  barBg: {
    height: 6,
    backgroundColor: "#1e293b",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 3,
  },

  // AI Insight Card
  insightCard: {
    backgroundColor: "rgba(99, 102, 241, 0.05)",
    padding: 20,
    borderRadius: 12,
    borderLeft: 4,
    borderLeftColor: "#6366f1",
    marginBottom: 30,
  },
  insightHeader: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
  },
  insightBody: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#cbd5e1",
  },

  // Roadmap
  roadmapItem: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    border: 1,
    borderColor: "#1e293b",
  },
  roadmapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  roadmapTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
  },
  priorityTag: {
    fontSize: 8,
    padding: "2 6",
    borderRadius: 4,
    fontWeight: "bold",
  },
  priorityHIGH: { backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" },
  priorityMEDIUM: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    color: "#f59e0b",
  },
  priorityLOW: { backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981" },
  roadmapDesc: {
    fontSize: 9,
    color: "#94a3b8",
  },
  // Points Section
  pointsContainer: {
    gap: 0,
  },
  pointGroup: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 8,
    border: 1,
    borderColor: "#1e293b",
  },
  pointTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  pointItem: {
    fontSize: 9,
    color: "#cbd5e1",
    marginBottom: 4,
    flexDirection: "row",
  },
  pointBullet: {
    width: 10,
    color: "#6366f1",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 30,
    backgroundColor: "#0f172a",
    borderTop: 1,
    borderTopColor: "#1e293b",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
    color: "#64748b",
  },
  shareText: {
    fontSize: 9,
    color: "#6366f1",
    fontWeight: "bold",
  },
});

type Props = {
  data: QuizInsightPayload;
};

export const QuizReportPDF = ({ data }: Props) => {
  const getPerformanceLabel = (score: number) => {
    if (score >= 90) return "Expert";
    if (score >= 70) return "Avançado";
    if (score >= 50) return "Intermediário";
    return "Iniciante";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.bgCircle} />

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandContainer}>
              <Image
                src={`${typeof window !== "undefined" ? window.location.origin : ""}/logo.svg`}
                style={styles.brandName}
              />
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {getPerformanceLabel(data.score.user)}
              </Text>
            </View>
          </View>

          {/* Hero Section */}
          <View style={styles.hero}>
            <View style={styles.mainScoreContainer}>
              <Text style={styles.scoreValue}>{data.score.user}</Text>
              <Text style={styles.scoreLabel}>PONTOS</Text>
            </View>
            <Text style={styles.heroTitle}>Seu Diagnóstico Técnico</Text>
            <Text style={styles.heroSubtitle}>
              Parabéns! Você concluiu a avaliação com um desempenho de destaque.
              Confira abaixo sua análise detalhada e próximos passos.
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>Top {data.percentile}%</Text>
              <Text style={styles.statLabel}>Dos usuários</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>#{data.ranking}</Text>
              <Text style={styles.statLabel}>Ranking Geral</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {data.correctAnswers} de{" "}
                {data.correctAnswers + data.wrongAnswers + data.ignoredAnswers}
              </Text>
              <Text style={styles.statLabel}>Questões</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{data.score.community}</Text>
              <Text style={styles.statLabel}>Média Global</Text>
            </View>
          </View>

          {/* Row 1: Performance Charts */}
          <View style={styles.contentRow}>
            {/* Left Column: Tech Performance */}
            <View style={styles.leftCol}>
              <View wrap={false}>
                <Text style={styles.sectionTitle}>
                  Performance por Tecnologia
                </Text>
                {data.stacks.map((stack: any) => (
                  <View key={stack.id} style={styles.skillItem}>
                    <View style={styles.skillInfo}>
                      <Text style={styles.skillName}>{stack.name}</Text>
                      <Text style={styles.skillPercent}>
                        {stack.score.user}%
                      </Text>
                    </View>
                    <View style={styles.barBg}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${stack.score.user}%` },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Right Column: Subjects Performance */}
            <View style={styles.rightCol}>
              <View wrap={false}>
                <Text style={styles.sectionTitle}>Performance por Assunto</Text>
                {data.subjects.map((subject: any) => (
                  <View key={subject.id} style={styles.skillItem}>
                    <View style={styles.skillInfo}>
                      <Text style={styles.skillName}>{subject.name}</Text>
                      <Text style={styles.skillPercent}>
                        {subject.score.user}%
                      </Text>
                    </View>
                    <View style={styles.barBg}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${subject.score.user}%` },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Gerado em {new Date().toLocaleDateString("pt-BR")} • Página 1 de 2
          </Text>
          <Text style={styles.shareText}>codedragon.ai/report</Text>
        </View>
      </Page>

      {/* Second Page: Study Plan */}
      <Page size="A4" style={styles.page}>
        <View
          style={[
            styles.bgCircle,
            { top: "auto", bottom: -100, left: -100, right: "auto" },
          ]}
        />

        <View style={styles.container}>
          {/* AI Diagnosis & Insights - Now on Page 2 at the top */}
          <View
            style={[
              styles.contentRow,
              { marginBottom: 20, alignItems: "stretch" },
            ]}
          >
            {/* Left Column: AI Mentor */}
            <View style={[styles.leftCol, { flex: 1 }]}>
              <View wrap={false}>
                <Text style={styles.sectionTitle}>Análise do Mentor AI</Text>
                <View style={styles.insightCard}>
                  <Text style={styles.insightHeader}>
                    {data.insights.title}
                  </Text>
                  <Text style={styles.insightBody}>
                    {data.insights.description}
                  </Text>
                </View>
              </View>
            </View>

            {/* Right Column: Strengths & Weaknesses */}
            <View style={[styles.rightCol, { flex: 1 }]}>
              <View wrap={false}>
                <Text style={styles.sectionTitle}>Pontos Fortes e Fracos</Text>
                <View style={styles.pointsContainer}>
                  <View style={styles.pointGroup}>
                    <Text style={[styles.pointTitle, { color: "#10b981" }]}>
                      Pontos Fortes
                    </Text>
                    {data.insights.strongPoints.map(
                      (point: string, i: number) => (
                        <View key={i} style={styles.pointItem}>
                          <Text style={styles.pointBullet}>•</Text>
                          <Text style={{ flex: 1 }}>{point}</Text>
                        </View>
                      ),
                    )}
                  </View>

                  <View style={[styles.pointGroup, { marginTop: 10 }]}>
                    <Text style={[styles.pointTitle, { color: "#ef4444" }]}>
                      Pontos Fracos
                    </Text>
                    {data.insights.weakPoints.map(
                      (point: string, i: number) => (
                        <View key={i} style={styles.pointItem}>
                          <Text style={styles.pointBullet}>•</Text>
                          <Text style={{ flex: 1 }}>{point}</Text>
                        </View>
                      ),
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={styles.heroTitle}>Seu Plano de Estudo</Text>
            <Text style={styles.heroSubtitle}>
              Abaixo estão os passos recomendados pela nossa IA para acelerar
              sua evolução técnica com base no seu diagnóstico.
            </Text>
          </View>

          <View style={{ gap: 10 }}>
            {data.roadmap.map((item: any, idx: number) => {
              return (
                idx <= 2 && (
                  <View key={idx} style={styles.roadmapItem} wrap={false}>
                    <View style={styles.roadmapHeader}>
                      <Text style={styles.roadmapTitle}>{item.title}</Text>
                      <Text
                        style={[
                          styles.priorityTag,
                          styles[
                            `priority${item.priority}` as keyof typeof styles
                          ],
                        ]}
                      >
                        {item.priority === "HIGH"
                          ? "Prioridade Alta"
                          : item.priority === "MEDIUM"
                            ? "Prioridade Média"
                            : "Prioridade Baixa"}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.roadmapDesc,
                        { marginTop: 6, lineHeight: 1.4 },
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                )
              );
            })}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Gerado em {new Date().toLocaleDateString("pt-BR")} • Página 2 de 2
          </Text>
          <Text style={styles.shareText}>codedragon.ai/report</Text>
        </View>
      </Page>
    </Document>
  );
};
