import { container } from "tsyringe";
import { QuizQuestionsController } from "./questions.controller";
import { QuizQuestionGenerateUseCase } from "./use-cases/generate-questions";
import { CreateSessionWithQuizPrismaRepository } from "@/infra/database/prisma/quiz/session/create-session-with-quiz.prisma.repository";

container.register("ICreateSessionWithQuizRepository", {
  useClass: CreateSessionWithQuizPrismaRepository,
});

container.register("QuizQuestionGenerateUseCase", {
  useClass: QuizQuestionGenerateUseCase,
});

export const quizQuestionsController = container.resolve(
  QuizQuestionsController,
);

