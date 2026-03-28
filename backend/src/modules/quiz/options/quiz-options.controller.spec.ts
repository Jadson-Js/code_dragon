import "reflect-metadata";
import type { Request, Response } from "express";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { QuizOptionsController } from "./quiz-options.controller";
import type { IGetQuizOptionsOutputDTO } from "./quiz-options.dto";

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

function makeController() {
  const getQuizOptionsUseCase = {
    execute: jest.fn<() => Promise<IGetQuizOptionsOutputDTO>>(),
  };

  const controller = new QuizOptionsController(getQuizOptionsUseCase as never);

  return { controller, getQuizOptionsUseCase };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("QuizOptionsController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call the use case and return 200 with the options", async () => {
    const { controller, getQuizOptionsUseCase } = makeController();

    const options: IGetQuizOptionsOutputDTO = {
      quizObjectives: [{ id: 1, name: "Objetivo 1" }],
      quizSubjects: [{ id: 2, name: "Assunto 1" }],
      seniorities: [{ id: 3, name: "Sênior" }],
      specialties: [{ id: 4, name: "Backend" }],
      stacks: [{ id: 5, name: "TypeScript" }],
    };

    getQuizOptionsUseCase.execute.mockResolvedValue(options);

    const request = {} as Request;
    const response = makeResponse();

    await controller.handle(request, response as unknown as Response);

    expect(getQuizOptionsUseCase.execute).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(options);
  });

  it("should propagate errors thrown by the use case", async () => {
    const { controller, getQuizOptionsUseCase } = makeController();

    getQuizOptionsUseCase.execute.mockRejectedValue(
      new Error("Unexpected error"),
    );

    const request = {} as Request;
    const response = makeResponse();

    await expect(
      controller.handle(request, response as unknown as Response),
    ).rejects.toThrow("Unexpected error");
  });
});
