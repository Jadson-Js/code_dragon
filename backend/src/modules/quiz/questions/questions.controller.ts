import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { GenerateQuestionsUseCase } from "./use-cases/generate-questions";

@injectable()
export class QuestionsController {
  constructor(
    @inject("GenerateQuestionsUseCase")
    private readonly generateQuestionsUseCase: GenerateQuestionsUseCase,
  ) {}

  async generateQuestions(
    _request: Request,
    response: Response,
  ): Promise<Response<{ quizQuestions: string }>> {
    const result = await this.generateQuestionsUseCase.execute();

    return response.status(200).json({ quizQuestions: result });
  }
}
