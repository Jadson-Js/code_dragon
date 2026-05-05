import { inject, injectable } from "tsyringe";
import { GetLatestQuizReportPrismaRepository } from "@/infra/database/prisma/quiz/report/get-latest-quiz-report.prisma.repository";
import { NotFoundError } from "@/shared/app.error";
import type { IGetQuizReportResponse } from "./get-report.use-case";

@injectable()
export class GetLatestReportUseCase {
  constructor(
    @inject(GetLatestQuizReportPrismaRepository)
    private readonly getLatestQuizReportRepository: GetLatestQuizReportPrismaRepository,
  ) {}

  async execute({ userId }: { userId: string }): Promise<IGetQuizReportResponse> {
    const sessionQuiz = await this.getLatestQuizReportRepository.execute(userId);

    if (!sessionQuiz) {
      throw new NotFoundError("No completed quiz found for this user");
    }

    const { result, stacks, subjects, roadmaps } = sessionQuiz;

    if (!result) {
      throw new NotFoundError("Quiz report result not found");
    }

    return {
      sessionQuizId: sessionQuiz.id,
      sessionId: sessionQuiz.sessionId,
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
