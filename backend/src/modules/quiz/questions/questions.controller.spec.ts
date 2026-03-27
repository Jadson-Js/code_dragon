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
};

function makeResponse(): ResponseMock {
  const res = {} as ResponseMock;
  res.status = jest.fn<(code: number) => ResponseMock>().mockReturnValue(res);
  res.json = jest.fn<(body?: unknown) => ResponseMock>().mockReturnValue(res);
  return res;
}

function makeSavedQuestion(id: number): QuizQuestion {
  return QuizQuestion.create({
    id,
    quizObjectiveId: 1,
    seniorityId: 2,
    specialtyId: 3,
    statement: `Question ${id}`,
    alternatives: ["A", "B", "C", "D"],
    correctAlternativeIndex: 0,
    code: null,
  });
}

function makeController() {
  const quizQuestionGenerateUseCase = {
    execute:
      jest.fn<
        (data: IQuizQuestionGenerateInputDTO) => Promise<QuizQuestion[]>
      >(),
  };

  const controller = new QuizQuestionsController(
    quizQuestionGenerateUseCase as never,
  );

  return { controller, quizQuestionGenerateUseCase };
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
    } as unknown as Request;
    const response = makeResponse();

    await controller.generateQuestions(
      request,
      response as unknown as Response,
    );

    expect(quizQuestionGenerateUseCase.execute).toHaveBeenCalledTimes(1);
    expect(quizQuestionGenerateUseCase.execute).toHaveBeenCalledWith(
      request.body,
    );
  });

  it("should respond with 201 and the questions returned by the use case", async () => {
    const { controller, quizQuestionGenerateUseCase } = makeController();

    const questions = [
      makeSavedQuestion(1),
      makeSavedQuestion(2),
      makeSavedQuestion(3),
    ];
    quizQuestionGenerateUseCase.execute.mockResolvedValue(questions);

    const request = { body: {} } as unknown as Request;
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

    const request = { body: {} } as unknown as Request;
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

    const request = { body: {} } as unknown as Request;
    const response = makeResponse();

    await expect(
      controller.generateQuestions(request, response as unknown as Response),
    ).rejects.toThrow("Use case failed");
  });
});
