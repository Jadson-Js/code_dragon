import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";
import { quizQuestionPrismaToDomain } from "./mappers";
import type { IQuizQuestionRepository } from "@/domain/database/repositories/quiz-question.repository";
import type { QuizQuestion } from "@/domain/entities/quiz-question.entity";

@injectable()
export class QuizQuestionPrismaRepository implements IQuizQuestionRepository {
  async create(data: QuizQuestion): Promise<QuizQuestion> {
    const response = await prisma.quizQuestion.create({
      data: data,
    });

    return quizQuestionPrismaToDomain(response);
  }
}
