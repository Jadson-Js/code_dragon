export interface IGenerateQuizQuestionByGeminiInputProvider {
  quizObjective: { id: number; name: string; description: string };
  quizSubjects: { id: number; name: string; description: string }[] | null;
  seniority: { id: number; name: string };
  specialty: { id: number; name: string };
  stacks: { id: number; name: string }[];
  quantityPerBatch: number;
}

export interface IGenerateQuizQuestionByGeminiOutputProvider {
  statement: string;
  alternatives: string[];
  correctAlternativeIndex: number;
  code: string | null;
}

export interface IGeminiProvider {
  generateQuizQuestion(
    data: IGenerateQuizQuestionByGeminiInputProvider,
  ): Promise<IGenerateQuizQuestionByGeminiOutputProvider[]>;
}
