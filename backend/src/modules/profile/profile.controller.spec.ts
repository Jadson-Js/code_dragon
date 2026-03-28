import "reflect-metadata";
import type { Request, Response } from "express";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { ProfileController } from "./profile.controller";

type ResponseMock = {
  status: jest.MockedFunction<(code: number) => ResponseMock>;
  json: jest.MockedFunction<(body?: unknown) => ResponseMock>;
};

function makeResponse(): ResponseMock {
  const response = {} as ResponseMock;
  response.status = jest
    .fn<(code: number) => ResponseMock>()
    .mockReturnValue(response);
  response.json = jest
    .fn<(body?: unknown) => ResponseMock>()
    .mockReturnValue(response);
  return response;
}

function makeController() {
  const createProfileUseCase = {
    execute: jest.fn<(input: unknown) => Promise<unknown>>(),
  };
  const getOnboardingOptionsUseCase = {
    execute: jest.fn<() => Promise<unknown>>(),
  };
  const getProfileByUserIdUseCase = {
    execute: jest.fn<(userId: string) => Promise<unknown>>(),
  };

  const controller = new ProfileController(
    createProfileUseCase as never,
    getOnboardingOptionsUseCase as never,
    getProfileByUserIdUseCase as never,
  );

  return {
    controller,
    createProfileUseCase,
    getOnboardingOptionsUseCase,
    getProfileByUserIdUseCase,
  };
}

describe("ProfileController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create should call use case with body + userId and return 201", async () => {
    const { controller, createProfileUseCase } = makeController();
    createProfileUseCase.execute.mockResolvedValue({ id: "profile-1" });

    const request = {
      body: {
        ageRangeId: 1,
        seniorityId: 2,
        specialtyId: 3,
        careerObjectiveId: 4,
        stacksId: [10],
      },
      user: { id: "user-1" },
    } as unknown as Request;
    const response = makeResponse();

    await controller.create(request, response as unknown as Response);

    expect(createProfileUseCase.execute).toHaveBeenCalledWith({
      ...request.body,
      userId: "user-1",
    });
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({ id: "profile-1" });
  });

  it("getOnboardingOptions should call use case and return 200", async () => {
    const { controller, getOnboardingOptionsUseCase } = makeController();
    const options = { ageRanges: [], seniorities: [] };
    getOnboardingOptionsUseCase.execute.mockResolvedValue(options);

    const request = {} as unknown as Request;
    const response = makeResponse();

    await controller.getOnboardingOptions(
      request,
      response as unknown as Response,
    );

    expect(getOnboardingOptionsUseCase.execute).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(options);
  });

  it("getMe should call use case with userId and return 200", async () => {
    const { controller, getProfileByUserIdUseCase } = makeController();
    const profile = { id: "profile-1", userId: "user-1" };
    getProfileByUserIdUseCase.execute.mockResolvedValue(profile);

    const request = { user: { id: "user-1" } } as unknown as Request;
    const response = makeResponse();

    await controller.getMe(request, response as unknown as Response);

    expect(getProfileByUserIdUseCase.execute).toHaveBeenCalledWith("user-1");
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(profile);
  });
});
