import "reflect-metadata";
import { describe, expect, it, jest, beforeAll } from "@jest/globals";

jest.unstable_mockModule("../../../../prisma/client", () => ({
  prisma: {},
}));

let CreateFeedbackUseCase: any;
let AppError: any;
let BadRequestError: any;
let Feedback: any;

describe("CreateFeedbackUseCase", () => {
  beforeAll(async () => {
    ({ CreateFeedbackUseCase } = await import("./create-feedback"));
    ({ AppError, BadRequestError } = await import("@/shared/app.error"));
    ({ Feedback } = await import("@/entities/feedback.entity"));
  });

  // ─── Mocks ───────────────────────────────────────────────────────────────────
  const makeFeedbackRepository = () => ({
    create: jest.fn().mockImplementation(async (feedback: any) => feedback),
  });

  // ─── Factory ─────────────────────────────────────────────────────────────────
  const makeSut = (overrides: any = {}) => {
    const feedbackRepository = overrides.feedbackRepository ?? makeFeedbackRepository();
    const sut = new CreateFeedbackUseCase(feedbackRepository);
    return { sut, feedbackRepository };
  };

  const validData = {
    userId: "user-id",
    rate: 5,
    reason: "Great app",
    description: "I love the UI",
    featureId: 1,
    sessionId: "session-id",
  };

  it("should create a feedback with all data successfully", async () => {
    const { sut, feedbackRepository } = makeSut();

    await sut.execute(validData);

    expect(feedbackRepository.create).toHaveBeenCalledTimes(1);
    expect(feedbackRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: validData.userId,
        rate: validData.rate,
        reason: validData.reason,
        description: validData.description,
        featureId: validData.featureId,
        sessionId: validData.sessionId,
      })
    );
  });

  it("should create a feedback with only mandatory data", async () => {
    const { sut, feedbackRepository } = makeSut();
    const mandatoryData = {
      userId: "user-id",
      rate: 4,
      reason: "Good",
      description: "Nice work",
    };

    await sut.execute(mandatoryData);

    expect(feedbackRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mandatoryData.userId,
        rate: mandatoryData.rate,
        featureId: null,
        sessionId: null,
      })
    );
  });

  describe("when rate is invalid", () => {
    it("should throw AppError if rate is less than 1", async () => {
      const { sut } = makeSut();
      const invalidData = { ...validData, rate: 0 };

      await expect(sut.execute(invalidData)).rejects.toThrow(
        new BadRequestError("Rate must be between 1 and 5")
      );
    });

    it("should throw AppError if rate is greater than 5", async () => {
      const { sut } = makeSut();
      const invalidData = { ...validData, rate: 6 };

      await expect(sut.execute(invalidData)).rejects.toThrow(
        new BadRequestError("Rate must be between 1 and 5")
      );
    });
  });
});
