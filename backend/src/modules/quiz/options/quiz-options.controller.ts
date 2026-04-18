import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { GetQuizOptionsUseCase } from "./use-cases/get-quiz-options";

@injectable()
export class QuizOptionsController {
  constructor(
    @inject("GetQuizOptionsUseCase")
    private readonly getQuizOptionsUseCase: GetQuizOptionsUseCase,
  ) {}

  async handle(_request: Request, response: Response): Promise<Response> {
    const result = await this.getQuizOptionsUseCase.execute();
    return response.status(200).json(result);
  }
}
