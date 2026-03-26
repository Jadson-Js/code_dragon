import type { QuizQuestion } from "@/domain/entities/quiz-question.entity";

export interface IQuizQuestionRepository {
  create(data: QuizQuestion): Promise<QuizQuestion>;
}
