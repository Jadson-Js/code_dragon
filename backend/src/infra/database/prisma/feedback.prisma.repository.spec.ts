import "reflect-metadata";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { Feedback } from "@/entities/feedback.entity";

const prismaMock = {
  feedback: {
    create: jest.fn<any>(),
  },
};

jest.unstable_mockModule("../../../../prisma/client", () => ({
  prisma: prismaMock,
}));

let FeedbackPrismaRepository: {
  new (): {
    create(data: {
      userId: string;
      featureId?: number;
      sessionId?: string;
      rate: number;
      reason: string;
      description: string;
    }): Promise<Feedback>;
  };
};

describe("FeedbackPrismaRepository", () => {
  beforeAll(async () => {
    ({ FeedbackPrismaRepository } =
      await import("./feedback.prisma.repository"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create should persist and return mapped feedback", async () => {
    const repository = new FeedbackPrismaRepository();
    const now = new Date();
    const feedback = Feedback.create({
      id: "feedback-1",
      userId: "user-1",
      rate: 5,
      reason: "Great",
      description: "App is awesome",
      createdAt: now,
      updatedAt: now,
    });

    prismaMock.feedback.create.mockResolvedValue({
      id: "feedback-1",
      userId: "user-1",
      rate: 5,
      reason: "Great",
      description: "App is awesome",
      featureId: null,
      sessionId: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      get toDomain() {
        return Feedback.create(this as any);
      },
    });

    const result = await repository.create(feedback);

    expect(prismaMock.feedback.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: feedback.userId,
        rate: feedback.rate,
        reason: feedback.reason,
        description: feedback.description,
      }),
    });
    expect(result).toBeInstanceOf(Feedback);
    expect(result.rate).toBe(5);
  });
});
