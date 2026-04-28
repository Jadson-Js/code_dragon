import type { Prisma, QuizQuestion } from "generated/prisma/client";
import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";
import type { QuizSubject, Stack } from "generated/prisma/browser";

@injectable()
export class QuizQuestionPrismaRepository {
  async create(data: Prisma.QuizQuestionCreateInput): Promise<QuizQuestion> {
    const response = await prisma.quizQuestion.create({
      data,
    });

    return response as QuizQuestion;
  }

  async createMany(
    data: Prisma.QuizQuestionCreateManyInput[],
  ): Promise<QuizQuestion[]> {
    const response = await prisma.quizQuestion.createManyAndReturn({
      data,
    });

    return response as QuizQuestion[];
  }

  async findBySessionQuizId(sessionQuizId: string): Promise<QuizQuestion[]> {
    const questions = await prisma.quizQuestion.findMany({
      where: { sessionQuizId },
    });

    return questions as QuizQuestion[];
  }

  async countBySessionQuizId(sessionQuizId: string): Promise<number> {
    return await prisma.quizQuestion.count({
      where: { sessionQuizId },
    });
  }

  async findManyByIds(
    ids: number[],
  ): Promise<(QuizQuestion & { stack: Stack; subject: QuizSubject })[]> {
    const questions = await prisma.quizQuestion.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        stack: true,
        subject: true,
      },
    });

    return questions as (QuizQuestion & {
      stack: Stack;
      subject: QuizSubject;
    })[];
  }
}
