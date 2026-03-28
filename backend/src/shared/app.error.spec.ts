import { describe, expect, it } from "@jest/globals";
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  TooManyRequestsError,
  InternalServerError,
} from "./app.error";

describe("AppError hierarchy", () => {
  it("AppError should hold statusCode and message", () => {
    const err = new AppError(418, "I am a teapot");
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(418);
    expect(err.message).toBe("I am a teapot");
  });

  it("BadRequestError should have statusCode 400", () => {
    const err = new BadRequestError("bad request");
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe("bad request");
  });

  it("UnauthorizedError should have statusCode 401", () => {
    const err = new UnauthorizedError("unauthorized");
    expect(err.statusCode).toBe(401);
  });

  it("ForbiddenError should have statusCode 403", () => {
    const err = new ForbiddenError("forbidden");
    expect(err.statusCode).toBe(403);
  });

  it("NotFoundError should have statusCode 404", () => {
    const err = new NotFoundError("not found");
    expect(err.statusCode).toBe(404);
  });

  it("ConflictError should have statusCode 409", () => {
    const err = new ConflictError("conflict");
    expect(err.statusCode).toBe(409);
  });

  it("TooManyRequestsError should have statusCode 429 with default message", () => {
    const err = new TooManyRequestsError();
    expect(err.statusCode).toBe(429);
    expect(err.message).toBe("Too many requests, please try again later");
  });

  it("TooManyRequestsError should accept a custom message", () => {
    const err = new TooManyRequestsError("slow down");
    expect(err.message).toBe("slow down");
  });

  it("InternalServerError should have statusCode 500 with default message", () => {
    const err = new InternalServerError();
    expect(err.statusCode).toBe(500);
    expect(err.message).toBe("Internal server error");
  });

  it("InternalServerError should accept a custom message", () => {
    const err = new InternalServerError("boom");
    expect(err.message).toBe("boom");
  });
});
