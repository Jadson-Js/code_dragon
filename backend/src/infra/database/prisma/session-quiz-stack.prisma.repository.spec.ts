import "reflect-metadata";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

const prismaMock = {
  sessionQuizStack: {
    groupBy: jest.fn<any>(),
  },
};

jest.unstable_mockModule("../../../../prisma/client", () => ({
  prisma: prismaMock,
}));

let SessionQuizStackPrismaRepository: any;

describe("SessionQuizStackPrismaRepository", () => {
  beforeAll(async () => {
    ({ SessionQuizStackPrismaRepository } = await import(
      "./session-quiz-stack.prisma.repository"
    ));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should find average scores by stack ids and seniority", async () => {
    const repository = new SessionQuizStackPrismaRepository();
    const stackIds = [1, 2];
    const seniorityId = 3;

    prismaMock.sessionQuizStack.groupBy.mockResolvedValue([
      {
        stackId: 1,
        _avg: {
          score: 75,
        },
      },
      {
        stackId: 2,
        _avg: {
          score: 85,
        },
      },
    ]);

    const result = await repository.findAverageScoreByContext(
      stackIds,
      seniorityId,
    );

    expect(prismaMock.sessionQuizStack.groupBy).toHaveBeenCalledWith({
      by: ["stackId"],
      where: {
        stackId: { in: stackIds },
        score: { not: null },
        sessionQuiz: { seniorityId },
      },
      _avg: {
        score: true,
      },
    });
    expect(result).toEqual([
      { stackId: 1, averageScore: 75 },
      { stackId: 2, averageScore: 85 },
    ]);
  });

  it("should return rounded score and handle null average", async () => {
    const repository = new SessionQuizStackPrismaRepository();
    prismaMock.sessionQuizStack.groupBy.mockResolvedValue([
      {
        stackId: 1,
        _avg: {
          score: 75.6,
        },
      },
      {
        stackId: 2,
        _avg: {
          score: null,
        },
      },
    ]);

    const result = await repository.findAverageScoreByContext([1, 2], 3);

    expect(result).toEqual([
      { stackId: 1, averageScore: 76 },
      { stackId: 2, averageScore: 0 },
    ]);
  });
});
