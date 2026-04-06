import "reflect-metadata";
import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { QuizQuestionsController } from "./questions.controller";
import { QuizQuestion } from "@/domain/entities/quiz-question.entity";
import type { IQuizQuestionGenerateInputDTO } from "./questions.dto";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type ResponseMock = {
  status: jest.MockedFunction<(code: number) => ResponseMock>;
  json: jest.MockedFunction<(body?: unknown) => ResponseMock>;
  setHeader: jest.MockedFunction<(name: string, value: string) => ResponseMock>;
};

function makeResponse(): ResponseMock {
  const res = {} as ResponseMock;
  res.status = jest.fn<(code: number) => ResponseMock>().mockReturnValue(res);
  res.json = jest.fn<(body?: unknown) => ResponseMock>().mockReturnValue(res);
  res.setHeader = jest.fn<(name: string, value: string) => ResponseMock>().mockReturnValue(res);
  return res;
}

function makeSavedQuestion(id: number): QuizQuestion {
  return QuizQuestion.create({
    id,
    statement: `Question ${id}`,
    alternatives: ["A", "B", "C", "D"],
    correctAlternativeIndex: 0,
    code: null,
    sessionQuizId: "session-1",
  });
}

function makeController() {
  const quizQuestionGenerateUseCase = {
    execute: jest.fn<any>(),
  };

  const quizQuestionStreamUseCase = {
    execute: jest.fn<any>(),
  };

  const controller = new QuizQuestionsController(
    quizQuestionGenerateUseCase as any,
    quizQuestionStreamUseCase as any,
  );

  return {
    controller,
    quizQuestionGenerateUseCase,
    quizQuestionStreamUseCase,
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("QuizQuestionsController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call the use case with the request body", async () => {
    const { controller, quizQuestionGenerateUseCase } = makeController();

    quizQuestionGenerateUseCase.execute.mockResolvedValue([]);

    const request = {
      body: {
        quizObjectiveId: 1,
        seniorityId: 2,
        specialtyId: 3,
        stacksId: [10],
        quantity: 5,
        saveInProfile: false,
      },
      user: { id: "user-1" },
    } as unknown as Request;
    const response = makeResponse();

    await controller.generateQuestions(
      request,
      response as unknown as Response,
    );

    expect(quizQuestionGenerateUseCase.execute).toHaveBeenCalledTimes(1);
    expect(quizQuestionGenerateUseCase.execute).toHaveBeenCalledWith({
      ...request.body,
      userId: "user-1",
    });
  });

  it("should respond with 201 and the questions returned by the use case", async () => {
    const { controller, quizQuestionGenerateUseCase } = makeController();

    const questions = [
      makeSavedQuestion(1),
      makeSavedQuestion(2),
      makeSavedQuestion(3),
    ];
    quizQuestionGenerateUseCase.execute.mockResolvedValue(questions);

    const request = { body: {}, user: { id: "user-1" } } as unknown as Request;
    const response = makeResponse();

    await controller.generateQuestions(
      request,
      response as unknown as Response,
    );

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(questions);
  });

  it("should respond with 201 and an empty array when the use case returns nothing", async () => {
    const { controller, quizQuestionGenerateUseCase } = makeController();

    quizQuestionGenerateUseCase.execute.mockResolvedValue([]);

    const request = { body: {}, user: { id: "user-1" } } as unknown as Request;
    const response = makeResponse();

    await controller.generateQuestions(
      request,
      response as unknown as Response,
    );

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith([]);
  });

  it("should propagate errors thrown by the use case", async () => {
    const { controller, quizQuestionGenerateUseCase } = makeController();

    quizQuestionGenerateUseCase.execute.mockRejectedValue(
      new Error("Use case failed"),
    );

    const request = { body: {}, user: { id: "user-1" } } as unknown as Request;
    const response = makeResponse();

    await expect(
      controller.generateQuestions(request, response as unknown as Response),
    ).rejects.toThrow("Use case failed");
  });

  describe("streamQuestions", () => {
    it("should set SSE headers and call stream use case", async () => {
      const { controller, quizQuestionStreamUseCase } = makeController();
      const request = {
        params: { session_quiz_id: "session-1" },
      } as unknown as Request;
      const response = makeResponse();

      await controller.streamQuestions(
        request,
        response as unknown as Response,
      );

      expect(response.setHeader).toHaveBeenCalledWith("Content-Type", "text/event-stream");
      expect(response.setHeader).toHaveBeenCalledWith("Cache-Control", "no-cache");
      expect(response.setHeader).toHaveBeenCalledWith("Connection", "keep-alive");
      expect(quizQuestionStreamUseCase.execute).toHaveBeenCalledWith(
        { sessionQuizId: "session-1" },
        response,
      );
    });

    it("should propagate errors from stream use case", async () => {
      const { controller, quizQuestionStreamUseCase } = makeController();
      const request = {
        params: { session_quiz_id: "session-1" },
      } as unknown as Request;
      const response = makeResponse();

      quizQuestionStreamUseCase.execute.mockRejectedValue(new Error("Stream failed"));

      await expect(
        controller.streamQuestions(request, response as unknown as Response),
      ).rejects.toThrow("Stream failed");
    });
  });
});
