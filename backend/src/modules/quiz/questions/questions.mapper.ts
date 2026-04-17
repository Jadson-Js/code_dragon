import type { IGetQuizQuestionContextOutputRepository } from "@/infra/database/prisma/quiz/questions/get-quiz-context.prisma.repository";
import type { IGenerateQuizQuestionByGeminiInputProvider } from "@/infra/providers/gemini.provider";
import type { SessionQuiz } from "@/entities/session-quiz.entity";

export function mapContextToGeminiInput(
  context: IGetQuizQuestionContextOutputRepository,
  quantityPerBatch: number,
  sessionQuiz: SessionQuiz,
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
    sessionQuiz,
  };
}
