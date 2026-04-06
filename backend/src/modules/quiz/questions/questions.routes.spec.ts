import "reflect-metadata";
import { jest, describe, expect, it } from "@jest/globals";

// Mock internal modules with unstable_mockModule for ESM (experimental-vm-modules)
// This must happen before any imports are evaluated
jest.unstable_mockModule("./questions.container", () => ({
  quizQuestionsController: {
    generateQuestions: { bind: jest.fn().mockReturnValue("handler-gen") },
    streamQuestions: { bind: jest.fn().mockReturnValue("handler-stream") },
  },
}));

jest.unstable_mockModule("@/infra/container/providers", () => ({
  ensureAuthenticated: { authAccess: { bind: jest.fn().mockReturnValue("auth-mid") } },
  simpleRateLimitMiddleware: { handle: jest.fn().mockReturnValue("rate-mid") },
}));

jest.unstable_mockModule("@/infra/http/middlewares/validate.middleware", () => ({
  validate: jest.fn().mockImplementation((s) => `val-${s}`),
}));

jest.unstable_mockModule("./questions.schema", () => ({
  quizQuestionGenerateSchema: "schema-gen",
  quizQuestionStreamSchema: "schema-stream",
}));

// Mock express (standard mock should still work)
const mockRouter = {
  post: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
};

jest.mock("express", () => ({
  Router: () => mockRouter,
}));

describe("Questions Routes ESM Mocked Test", () => {
  it("should register routes using ESM mocks", async () => {
    // Dynamic import to allow ESM mocks to take effect
    await import("./questions.routes");

    expect(mockRouter.post).toHaveBeenCalledWith(
      "/generate",
      "rate-mid",
      "val-schema-gen",
      "auth-mid",
      "handler-gen",
    );

    expect(mockRouter.get).toHaveBeenCalledWith(
      "/stream/:session_quiz_id",
      "rate-mid",
      "val-schema-stream",
      "auth-mid",
      "handler-stream",
    );
  });
});
