import "reflect-metadata";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { SessionQuiz } from "@/entities/session-quiz.entity";
import { SessionQuizStatus } from "generated/prisma/enums";

const prismaMock = {
  sessionQuiz: {
    findUnique: jest.fn<any>(),
    update: jest.fn<any>(),
  },
};

jest.unstable_mockModule("@/../prisma/client", () => ({
  prisma: prismaMock,
}));

let SessionQuizPrismaRepository: {
  new (): {
    findById(id: string): Promise<SessionQuiz | null>;
    updateStatus(id: string, status: SessionQuizStatus): Promise<void>;
  };
};

describe("SessionQuizPrismaRepository", () => {
  beforeAll(async () => {
    ({ SessionQuizPrismaRepository } = await import("./session-quiz.prisma.repository"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("findById should return mapped session quiz", async () => {
    const repository = new SessionQuizPrismaRepository();
    const now = new Date();
    prismaMock.sessionQuiz.findUnique.mockResolvedValue({
      id: "sq-1",
      sessionId: "s-1",
      userId: "u-1",
      seniorityId: 1,
      specialtyId: 2,
      quizObjectiveId: 3,
      quantityQuestions: 10,
      score: 0,
      status: SessionQuizStatus.GENERATING,
      createdAt: now,
      updatedAt: now,
      get toDomain() {
        return SessionQuiz.create(this as any);
      },
    });

    const result = await repository.findById("sq-1");

    expect(prismaMock.sessionQuiz.findUnique).toHaveBeenCalledWith({
      where: { id: "sq-1" },
    });
    expect(result).toBeInstanceOf(SessionQuiz);
    expect(result?.id).toBe("sq-1");
  });

  it("findById should return null when not found", async () => {
    const repository = new SessionQuizPrismaRepository();
    prismaMock.sessionQuiz.findUnique.mockResolvedValue(null);

    const result = await repository.findById("missing");

    expect(result).toBeNull();
  });

  it("updateStatus should update the status of the session quiz", async () => {
    const repository = new SessionQuizPrismaRepository();
    prismaMock.sessionQuiz.update.mockResolvedValue({ id: "sq-1" });

    await repository.updateStatus("sq-1", SessionQuizStatus.FINISHED);

    expect(prismaMock.sessionQuiz.update).toHaveBeenCalledWith({
      where: { id: "sq-1" },
      data: { status: SessionQuizStatus.FINISHED },
    });
  });
});
