export interface IQuizQuestionGenerateByGeminiInputProvider {
  quizObjective: { id: number; name: string; description: string };
  quizSubject: { id: number; name: string; description: string }[] | null;
  seniority: { id: number; name: string; description: string };
  specialty: { id: number; name: string; description: string };
  stacks: { id: number; name: string; description: string }[];
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
