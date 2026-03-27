import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { QuizQuestionGenerateUseCase } from "./use-cases/generate-questions";

@injectable()
export class QuizQuestionsController {
  constructor(
    @inject("QuizQuestionGenerateUseCase")
    private readonly quizQuestionGenerateUseCase: QuizQuestionGenerateUseCase,
  ) {}

  async generateQuestions(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const questions = await this.quizQuestionGenerateUseCase.execute(
      request.body,
    );

    return response.status(201).json(questions);
  }
}
