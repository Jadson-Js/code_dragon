import { prisma } from "@/../prisma/client";
import type { QuizSubject } from "generated/prisma/browser";
import { injectable } from "tsyringe";

@injectable()
export class SessionQuizSubjectPrismaRepository {
  async findAverageScoreByContext(
    subjectIds: number[],
    seniorityId: number,
  ): Promise<{ subjectId: number; averageScore: number }[]> {
    const stats = await prisma.sessionQuizSubject.groupBy({
      by: ["subjectId"],
      where: {
        subjectId: { in: subjectIds },
        score: { not: null },
        sessionQuiz: { seniorityId },
      },
      _avg: {
        score: true,
      },
    });

    return stats.map((stat) => ({
      subjectId: stat.subjectId,
      averageScore: Math.round(stat._avg.score ?? 0),
    }));
  }
}
