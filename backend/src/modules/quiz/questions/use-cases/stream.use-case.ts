import { inject, injectable } from "tsyringe";
// No IQuizQuestionStreamInputDTO import

import { QuizQuestionPrismaRepository } from "@/infra/database/prisma/quiz-question.prisma.repository";
import { SessionQuizPrismaRepository } from "@/infra/database/prisma/session-quiz.prisma.repository";
import { QuizQuestionEventEmitter } from "@/infra/providers/quiz-question-event-emitter";
import type { Response } from "express";

@injectable()
export class QuizQuestionStreamUseCase {
  constructor(
    private readonly quizQuestionRepository: QuizQuestionPrismaRepository,

    private readonly quizQuestionEventEmitter: QuizQuestionEventEmitter,

    private readonly sessionQuizRepository: SessionQuizPrismaRepository,
  ) {}

  async execute(
    data: { sessionQuizId: string },
    response: Response,
  ): Promise<void> {
    const { sessionQuizId } = data;

    // 1. Return all questions generated so far
    const existingQuestions =
      await this.quizQuestionRepository.findBySessionQuizId(sessionQuizId);

    if (existingQuestions.length > 0) {
      response.write(`data: ${JSON.stringify(existingQuestions)}\n\n`);
    }

    // Check if already finished
    const sessionQuiz =
      await this.sessionQuizRepository.findById(sessionQuizId);
    if (
      sessionQuiz &&
      (sessionQuiz.status === "IN_PROGRESS" ||
        sessionQuiz.status === "COMPLETED")
    ) {
      response.write(
        `event: finished\ndata: ${JSON.stringify({ status: sessionQuiz.status, data: existingQuestions })}\n\n`,
      );
      response.end();
      return;
    }

    // 2. Listen for new questions
    const onNewQuestions = (questions: any[]) => {
      response.write(`data: ${JSON.stringify(questions)}\n\n`);
    };

    const onFinished = () => {
      response.end();
    };

    this.quizQuestionEventEmitter.onNewQuestions(sessionQuizId, onNewQuestions);
    this.quizQuestionEventEmitter.onFinished(sessionQuizId, onFinished);

    // 3. Clean up when connection closes
    response.on("close", () => {
      this.quizQuestionEventEmitter.offNewQuestions(
        sessionQuizId,
        onNewQuestions,
      );
      this.quizQuestionEventEmitter.offFinished(sessionQuizId, onFinished);
    });

    // Keep the function running (awaiting response close if we want the controller to await)
    return new Promise((resolve) => {
      response.on("close", resolve);
    });
  }
}
