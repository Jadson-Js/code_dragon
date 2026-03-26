import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";
import { quizQuestionPrismaToDomain } from "./mappers";
import type { IQuizQuestionRepository } from "@/domain/database/repositories/quiz-question.repository";
import type { QuizQuestion } from "@/domain/entities/quiz-question.entity";

@injectable()
export class QuizQuestionPrismaRepository implements IQuizQuestionRepository {
  async create(data: QuizQuestion): Promise<QuizQuestion> {
    const response = await prisma.quizQuestion.create({
      data: {
        quizObjectiveId: data.quizObjectiveId,
        quizSubjectId: data.quizSubjectId,
        seniorityId: data.seniorityId,
        specialtyId: data.specialtyId,
        statement: data.statement,
        alternatives: data.alternatives,
        correctAlternativeIndex: data.correctAlternativeIndex,
        code: data.code,
        reports: data.reports,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return quizQuestionPrismaToDomain(response);
  }

  async createMany(data: QuizQuestion[]): Promise<QuizQuestion[]> {
    const response = await prisma.quizQuestion.createManyAndReturn({
      data: data.map((item) => ({
        quizObjectiveId: item.quizObjectiveId,
        quizSubjectId: item.quizSubjectId,
        seniorityId: item.seniorityId,
        specialtyId: item.specialtyId,
        statement: item.statement,
        alternatives: item.alternatives,
        correctAlternativeIndex: item.correctAlternativeIndex,
        code: item.code,
        reports: item.reports,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });

    return response.map(quizQuestionPrismaToDomain);
  }
}
