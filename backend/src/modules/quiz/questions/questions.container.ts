import { container } from "tsyringe";
import { QuizQuestionsController } from "./questions.controller";
import { QuizQuestionGenerateUseCase } from "./use-cases/generate-questions";

container.register("QuizQuestionGenerateUseCase", {
  useClass: QuizQuestionGenerateUseCase,
});

export const quizQuestionsController = container.resolve(
  QuizQuestionsController,
);
