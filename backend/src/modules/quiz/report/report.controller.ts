import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
  QuizReportSubmitUseCase,
  type IQuizReportSubmitResponse,
} from "./use-cases/submit.use-case";
import {
  GetReportUseCase,
  type IGetQuizReportResponse,
} from "./use-cases/get-report.use-case";
import { GetLatestReportUseCase } from "./use-cases/get-latest-report.use-case";

@injectable()
export class QuizReportController {
  constructor(
    @inject(QuizReportSubmitUseCase)
    private readonly quizReportSubmitUseCase: QuizReportSubmitUseCase,
    @inject(GetReportUseCase)
    private readonly getReportUseCase: GetReportUseCase,
    @inject(GetLatestReportUseCase)
    private readonly getLatestReportUseCase: GetLatestReportUseCase,
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

  async getReport(
    request: Request,
    response: Response,
  ): Promise<Response<IGetQuizReportResponse>> {
    const params = request.params;

    const quizReportResponse = await this.getReportUseCase.execute({
      sessionQuizId: params.sessionQuizId as string,
    });

    return response.status(200).json(quizReportResponse);
  }

  async getLatestReport(
    request: Request,
    response: Response,
  ): Promise<Response<IGetQuizReportResponse>> {
    const userId = request.user.id;

    const quizReportResponse = await this.getLatestReportUseCase.execute({
      userId,
    });

    return response.status(200).json(quizReportResponse);
  }
}
