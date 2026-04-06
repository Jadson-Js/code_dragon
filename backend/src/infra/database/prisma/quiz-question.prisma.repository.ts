import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";
import type { IQuizQuestionRepository } from "@/domain/database/repositories/quiz-question.repository";
import type { QuizQuestion } from "@/domain/entities/quiz-question.entity";

@injectable()
export class QuizQuestionPrismaRepository implements IQuizQuestionRepository {
  async create(data: QuizQuestion): Promise<QuizQuestion> {
    const response = await prisma.quizQuestion.create({
      data: {
        statement: data.statement,
        alternatives: data.alternatives,
        correctAlternativeIndex: data.correctAlternativeIndex,
        code: data.code,
        reports: data.reports,
        sessionQuizId: data.sessionQuizId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return response.toDomain;
  }

  async createMany(data: QuizQuestion[]): Promise<QuizQuestion[]> {
    const response = await prisma.quizQuestion.createManyAndReturn({
      data: data.map((item) => ({
        statement: item.statement,
        alternatives: item.alternatives,
        correctAlternativeIndex: item.correctAlternativeIndex,
        code: item.code,
        reports: item.reports,
        sessionQuizId: item.sessionQuizId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });

    return response.map((item) => item.toDomain);
  }

  async findBySessionQuizId(sessionQuizId: string): Promise<QuizQuestion[]> {
    const questions = await prisma.quizQuestion.findMany({
      where: { sessionQuizId },
    });

    return questions.map((item) => item.toDomain);
  }

  async countBySessionQuizId(sessionQuizId: string): Promise<number> {
    return await prisma.quizQuestion.count({
      where: { sessionQuizId },
    });
  }
}
