import { prisma } from "@/../prisma/client";
import { injectable } from "tsyringe";

@injectable()
export class SessionQuizStackPrismaRepository {
  async findAverageScoreByContext(
    stackIds: number[],
    seniorityId: number,
  ): Promise<{ stackId: number; averageScore: number }[]> {
    const stats = await prisma.sessionQuizStack.groupBy({
      by: ["stackId"],
      where: {
        stackId: { in: stackIds },
        score: { not: null },
        sessionQuiz: { seniorityId },
      },
      _avg: {
        score: true,
      },
    });

    return stats.map((stat) => ({
      stackId: stat.stackId,
      averageScore: Math.round(stat._avg.score ?? 0),
    }));
  }
}
