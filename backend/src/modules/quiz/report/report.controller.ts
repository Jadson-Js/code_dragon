import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
  QuizReportSubmitUseCase,
  type IQuizReportSubmitResponse,
} from "./use-cases/submit.use-case";

@injectable()
export class QuizReportController {
  constructor(
    @inject(QuizReportSubmitUseCase)
    private readonly quizReportSubmitUseCase: QuizReportSubmitUseCase,
  ) {}

  async submit(
    request: Request,
    response: Response,
  ): Promise<Response<IQuizReportSubmitResponse>> {
    const userId = request.user.id;

    const quizReportSubmitResponse = await this.quizReportSubmitUseCase.execute(
      {
        ...request.body,
        userId,
      },
    );

    return response.status(201).json(quizReportSubmitResponse);
  }
}
