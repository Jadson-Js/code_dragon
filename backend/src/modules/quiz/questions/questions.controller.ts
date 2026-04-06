import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { QuizQuestionGenerateUseCase } from "./use-cases/generate-questions";
import type { QuizQuestionStreamUseCase } from "./use-cases/stream.use-case";

@injectable()
export class QuizQuestionsController {
  constructor(
    @inject("QuizQuestionGenerateUseCase")
    private readonly quizQuestionGenerateUseCase: QuizQuestionGenerateUseCase,

    @inject("QuizQuestionStreamUseCase")
    private readonly quizQuestionStreamUseCase: QuizQuestionStreamUseCase,
  ) {}

  async generateQuestions(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const userId = request.user.id;

    const questions = await this.quizQuestionGenerateUseCase.execute({
      ...request.body,
      userId,
    });

    return response.status(201).json(questions);
  }

  async streamQuestions(request: Request, response: Response): Promise<void> {
    response.setHeader("Content-Type", "text/event-stream");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Connection", "keep-alive");

    const session_quiz_id = request.params.session_quiz_id as string;

    await this.quizQuestionStreamUseCase.execute(
      { sessionQuizId: session_quiz_id },
      response,
    );
  }
}
