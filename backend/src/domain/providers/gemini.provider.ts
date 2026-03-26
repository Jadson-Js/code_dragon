export interface IQuizQuestionGenerateByGeminiInputProvider {
  quizObjective: { name: string; description: string };
  quizSubject: { name: string; description: string }[] | null;
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
