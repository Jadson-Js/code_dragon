import type { IGetQuizQuestionContextOutputRepository } from "@/domain/database/repositories/quiz/question/get-quiz-question-context.repository";
import type { IGenerateQuizQuestionByGeminiInputProvider } from "@/domain/providers/gemini.provider";

export function mapContextToGeminiInput(
  context: IGetQuizQuestionContextOutputRepository,
  quantityPerBatch: number,
): IGenerateQuizQuestionByGeminiInputProvider {
  return {
    quizObjective: {
      id: context.quizObjective.id as number,
      name: context.quizObjective.name,
      description: context.quizObjective.description,
    },
    quizSubjects: context.quizSubjects.map((s) => ({
      id: s.id as number,
      name: s.name,
      description: s.description,
    })),
    seniority: {
      id: context.seniority.id as number,
      name: context.seniority.name,
    },
    specialty: {
      id: context.specialty.id as number,
      name: context.specialty.name,
    },
    stacks: context.stacks.map((s) => ({
      id: s.id as number,
      name: s.name,
    })),
    quantityPerBatch,
  };
}
