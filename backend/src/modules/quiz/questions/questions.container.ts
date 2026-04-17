import { container } from "tsyringe";
import { QuizQuestionsController } from "./questions.controller";
import { QuizQuestionGenerateUseCase } from "./use-cases/generate-questions";
import { QuizQuestionStreamUseCase } from "./use-cases/stream.use-case";
import { CreateSessionWithQuizPrismaRepository } from "@/infra/database/prisma/quiz/session/create-session-with-quiz.prisma.repository";

container.registerSingleton(CreateSessionWithQuizPrismaRepository);

// Use Cases are resolved automatically by class token

export const quizQuestionsController = container.resolve(
  QuizQuestionsController,
);
