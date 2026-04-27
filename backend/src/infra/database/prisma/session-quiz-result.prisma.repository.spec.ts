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
  sessionQuizResult: {
    findMany: jest.fn<any>(),
  },
};

jest.unstable_mockModule("../../../../prisma/client", () => ({
  prisma: prismaMock,
}));

let SessionQuizResultPrismaRepository: {
  new (): {
    findManyScoreBySeniority(seniorityId: number): Promise<number[]>;
  };
};

describe("SessionQuizResultPrismaRepository", () => {
  beforeAll(async () => {
    ({ SessionQuizResultPrismaRepository } =
      await import("./session-quiz-result.prisma.repository"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should find results by seniority", async () => {
    const repository = new SessionQuizResultPrismaRepository();
    const mockResults = [
      {
        score: 90,
      },
      {
        score: 80,
      },
    ];

    prismaMock.sessionQuizResult.findMany.mockResolvedValue(mockResults);

    const seniority = 2;

    const result = await repository.findManyScoreBySeniority(seniority);

    expect(prismaMock.sessionQuizResult.findMany).toHaveBeenCalledWith({
      where: {
        sessionQuiz: {
          seniorityId: seniority,
        },
      },
      select: { score: true },
      orderBy: { score: "desc" },
    });
    expect(result).toEqual([90, 80]);
  });

  it("should return empty array when no results found", async () => {
    const repository = new SessionQuizResultPrismaRepository();
    prismaMock.sessionQuizResult.findMany.mockResolvedValue([]);

    const result = await repository.findManyScoreBySeniority(1);

    expect(result).toEqual([]);
    expect(prismaMock.sessionQuizResult.findMany).toHaveBeenCalled();
  });
});
