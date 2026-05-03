import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { CreateFeedbackUseCase } from "./use-cases/create-feedback";

@injectable()
export class FeedbackController {
  constructor(
    @inject(CreateFeedbackUseCase)
    private readonly createFeedbackUseCase: CreateFeedbackUseCase,
  ) {}

  async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    await this.createFeedbackUseCase.execute({
      userId,
      ...request.body,
    });

    return response.status(201).json({ message: "Feedback sent successfully" });
  }
}
