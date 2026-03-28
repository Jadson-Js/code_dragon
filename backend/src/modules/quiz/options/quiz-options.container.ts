import { container } from "tsyringe";
import { QuizOptionsController } from "./quiz-options.controller";
import { GetQuizOptionsUseCase } from "./use-cases/get-quiz-options";
import { QuizOptionsPrismaRepository } from "@/infra/database/prisma/quiz/options/quiz-options.prisma.repository";

// Specific repositories for the sub-module
container.register("IGetQuizOptionsRepository", {
  useClass: QuizOptionsPrismaRepository,
});

// Use Cases
container.register("GetQuizOptionsUseCase", { useClass: GetQuizOptionsUseCase });

// Controller instance
export const quizOptionsController = container.resolve(QuizOptionsController);
