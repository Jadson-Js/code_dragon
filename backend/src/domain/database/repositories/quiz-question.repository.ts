import type { QuizQuestion } from "@/domain/entities/quiz-question.entity";

export interface IQuizQuestionRepository {
  create(data: QuizQuestion): Promise<QuizQuestion>;
  createMany(data: QuizQuestion[]): Promise<QuizQuestion[]>;
  findBySessionQuizId(sessionQuizId: string): Promise<QuizQuestion[]>;
  countBySessionQuizId(sessionQuizId: string): Promise<number>;
}
