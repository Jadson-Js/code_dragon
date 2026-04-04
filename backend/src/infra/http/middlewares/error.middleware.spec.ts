import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { AppError } from "@/shared/app.error";
import { errorHandler } from "./error.middleware";

type ResponseMock = {
  status: jest.MockedFunction<(code: number) => ResponseMock>;
  json: jest.MockedFunction<(body: unknown) => ResponseMock>;
};

function makeResponse(): ResponseMock {
  const response = {} as ResponseMock;
  response.status = jest
    .fn<(code: number) => ResponseMock>()
    .mockReturnValue(response);
  response.json = jest
    .fn<(body: unknown) => ResponseMock>()
    .mockReturnValue(response);
  return response;
}

describe("errorHandler middleware", () => {
  it("should map AppError to status and message", () => {
    const response = makeResponse();
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const error = new AppError(418, "teapot");

    errorHandler(
      error,
      {} as Request,
      response as unknown as Response,
      jest.fn() as NextFunction,
    );

    expect(response.status).toHaveBeenCalledWith(418);
    expect(response.json).toHaveBeenCalledWith({
      status: "error",
      message: "teapot",
    });
    consoleSpy.mockRestore();
  });

  it("should map ZodError to validation response", () => {
    const response = makeResponse();
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const schema = z.object({ email: z.email() });
    const result = schema.safeParse({ email: "invalid" });
    const zodError = result.success ? new Error("unexpected") : result.error;

    errorHandler(
      zodError as ZodError,
      {} as Request,
      response as unknown as Response,
      jest.fn() as NextFunction,
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "validation_error",
        message: "Validation failed",
      }),
    );
    consoleSpy.mockRestore();
  });

  it("should map prisma P2002 code to 409 conflict", () => {
    const response = makeResponse();
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const prismaError = { code: "P2002" } as unknown as Error;

    errorHandler(
      prismaError,
      {} as Request,
      response as unknown as Response,
      jest.fn() as NextFunction,
    );

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith({
      status: "conflict",
      message: "This record already exists in the system.",
    });
    consoleSpy.mockRestore();
  });

  it("should map other prisma errors to 500", () => {
    const response = makeResponse();
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const prismaError = { code: "P9999" } as unknown as Error;

    errorHandler(
      prismaError,
      {} as Request,
      response as unknown as Response,
      jest.fn() as NextFunction,
    );

    expect(response.status).toHaveBeenCalledWith(500);
    consoleSpy.mockRestore();
  });

  it("should map unknown errors to 500", () => {
    const response = makeResponse();
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    errorHandler(
      new Error("unknown"),
      {} as Request,
      response as unknown as Response,
      jest.fn() as NextFunction,
    );

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      status: "internal_error",
      message: "An internal server error occurred.",
    });
    consoleSpy.mockRestore();
  });
});
