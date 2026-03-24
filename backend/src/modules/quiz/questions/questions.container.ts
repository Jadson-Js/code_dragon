import { container } from "tsyringe";
import { QuestionsController } from "./questions.controller";
import { GenerateQuestionsUseCase } from "./use-cases/generate-questions";

container.register("GenerateQuestionsUseCase", {
  useClass: GenerateQuestionsUseCase,
});

export const questionsController = container.resolve(QuestionsController);
