import type { QuizQuestion } from "../entities/quiz-question.entity";

export interface IQuizQuestionGenerateByGeminiInputProvider {
  quizObjective: string;
  quizSubject: string[];
  seniority: string;
  specialty: string[];
  stacks: string[];
}

export interface IQuizQuestionGenerateByGeminiOutputProvider {
  statement: string;
  alternatives: string[];
  correctAlternativeIndex: number;
  code: string | null;
}

export interface IGeminiProvider {
  generateQuizQuestion(
    data: IQuizQuestionGenerateByGeminiInputProvider,
  ): Promise<IQuizQuestionGenerateByGeminiOutputProvider[]>;
}
