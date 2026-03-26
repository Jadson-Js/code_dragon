import type { QuizQuestion } from "../entities/quiz-question.entity";

export interface IQuizQuestionGenerateByGeminiProvider {
  quizObjective: string;
  quizSubject: string[];
  seniority: string;
  specialty: string[];
  stacks: string[];
}

export interface IGeminiProvider {
  generateQuizQuestion(
    data: IQuizQuestionGenerateByGeminiProvider,
  ): Promise<QuizQuestion>;
}
