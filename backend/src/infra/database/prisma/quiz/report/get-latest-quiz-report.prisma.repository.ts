import { prisma } from "@/../prisma/client";
import { injectable } from "tsyringe";
import { SessionQuizStatus } from "generated/prisma/enums";

@injectable()
export class GetLatestQuizReportPrismaRepository {
  async execute(userId: string) {
    return await prisma.$transaction(async (tx) => {
      const data = await tx.sessionQuiz.findFirst({
        where: {
          userId,
          status: SessionQuizStatus.COMPLETED,
          result: { isNot: null },
        },
        orderBy: {
          createdAt: "desc",
        },
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
          session: true,
        },
      });

      return data;
    });
  }
}
