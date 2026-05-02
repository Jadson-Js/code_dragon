import { inject, injectable } from "tsyringe";
import { GetQuizReportPrismaRepository } from "@/infra/database/prisma/quiz/report/get-quiz-report.prisma.repository";
import { NotFoundError, BadRequestError } from "@/shared/app.error";
import {
  SessionQuizStatus,
  type SessionQuizRoadmapPriority,
} from "generated/prisma/enums";

type ScoreEntry = {
  id: number;
  name: string;
  score: { user: number; community: number };
};

export interface IGetQuizReportResponse {
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
  subjects: ScoreEntry[];
  stacks: ScoreEntry[];
  insights: {
    title: string;
    description: string;
    strongPoints: string[];
    weakPoints: string[];
  };
  roadmap: {
    title: string;
    description: string;
    priority: SessionQuizRoadmapPriority;
  }[];
}

@injectable()
export class GetReportUseCase {
  constructor(
    @inject(GetQuizReportPrismaRepository)
    private readonly getQuizReportRepository: GetQuizReportPrismaRepository,
  ) {}

  async execute({
    sessionQuizId,
  }: {
    sessionQuizId: string;
  }): Promise<IGetQuizReportResponse> {
    const sessionQuiz =
      await this.getQuizReportRepository.execute(sessionQuizId);

    if (!sessionQuiz) {
      throw new NotFoundError("Quiz session not found");
    }

    if (sessionQuiz.status !== SessionQuizStatus.COMPLETED) {
      throw new BadRequestError("Quiz session is not COMPLETED yet");
    }

    const { result, stacks, subjects, roadmaps } = sessionQuiz;

    if (!result) {
      throw new NotFoundError("Quiz report result not found");
    }

    return {
      sessionQuizId: sessionQuiz.id,
      score: {
        user: result.score,
        community: result.averageScore,
      },
      percentile: result.percentile,
      ranking: result.ranking,
      correctAnswers: result.correctAnswers,
      wrongAnswers: result.wrongAnswers,
      ignoredAnswers: result.ignoredAnswers,
      subjects: subjects.map((s) => ({
        id: s.subjectId,
        name: s.subject.name,
        score: {
          user: s.score ?? 0,
          community: s.averageScore ?? 0,
        },
      })),
      stacks: stacks.map((s) => ({
        id: s.stackId,
        name: s.stack.name,
        score: {
          user: s.score ?? 0,
          community: s.averageScore ?? 0,
        },
      })),
      insights: {
        title: result.title,
        description: result.description,
        strongPoints: result.strongPoints,
        weakPoints: result.weakPoints,
      },
      roadmap: roadmaps.map((r) => ({
        title: r.title,
        description: r.description,
        priority: r.priority,
      })),
    };
  }
}
