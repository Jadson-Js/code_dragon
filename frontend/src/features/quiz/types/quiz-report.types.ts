export type QuizInsightPayload = {
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
