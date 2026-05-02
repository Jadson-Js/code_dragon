import { prisma } from "@/../prisma/client";
import { injectable } from "tsyringe";

@injectable()
export class GetQuizReportPrismaRepository {
  async execute(sessionQuizId: string) {
    return await prisma.$transaction(async (tx) => {
      const data = await tx.sessionQuiz.findUnique({
        where: { id: sessionQuizId },
        include: {
          result: true,
          stacks: {
            include: {
              stack: true,
            },
          },
          subjects: {
            include: {
              subject: true,
            },
          },
          roadmaps: true,
        },
      });

      return data;
    });
  }
}
