import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { QuizQuestionGenerateUseCase } from "./use-cases/generate-questions";
import type { IQuizGenerateQuestionsResponseDTO } from "./questions.dto";

@injectable()
export class QuizQuestionsController {
  constructor(
    @inject("QuizQuestionGenerateUseCase")
    private readonly quizQuestionGenerateUseCase: QuizQuestionGenerateUseCase,
  ) {}

  async generateQuestions(
    request: Request,
    response: Response,
  ): Promise<Response<IQuizGenerateQuestionsResponseDTO>> {
    const question = await this.quizQuestionGenerateUseCase.execute(
      request.body,
    );

    return response.status(201).json({
      id: question.id,
    });
  }
}
