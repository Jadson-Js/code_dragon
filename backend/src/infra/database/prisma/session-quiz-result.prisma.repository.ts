import { prisma } from "@/../prisma/client";
import { injectable } from "tsyringe";

@injectable()
export class SessionQuizResultPrismaRepository {
  async findManyScoreBySeniority(seniorityId: number): Promise<number[]> {
    const result = await prisma.sessionQuizResult.findMany({
      where: {
        sessionQuiz: {
          seniorityId,
        },
      },
      select: {
        score: true,
      },
      orderBy: {
        score: "desc",
      },
    });

    return result.map((r) => r.score);
  }
}
