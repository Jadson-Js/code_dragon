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
  sessionQuizSubject: {
    groupBy: jest.fn<any>(),
  },
};

jest.unstable_mockModule("../../../../prisma/client", () => ({
  prisma: prismaMock,
}));

let SessionQuizSubjectPrismaRepository: any;

describe("SessionQuizSubjectPrismaRepository", () => {
  beforeAll(async () => {
    ({ SessionQuizSubjectPrismaRepository } = await import(
      "./session-quiz-subject.prisma.repository"
    ));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should find average scores by subject ids and seniority", async () => {
    const repository = new SessionQuizSubjectPrismaRepository();
    const subjectIds = [1, 2];
    const seniorityId = 3;

    prismaMock.sessionQuizSubject.groupBy.mockResolvedValue([
      {
        subjectId: 1,
        _avg: {
          score: 70,
        },
      },
      {
        subjectId: 2,
        _avg: {
          score: 80,
        },
      },
    ]);

    const result = await repository.findAverageScoreByContext(
      subjectIds,
      seniorityId,
    );

    expect(prismaMock.sessionQuizSubject.groupBy).toHaveBeenCalledWith({
      by: ["subjectId"],
      where: {
        subjectId: { in: subjectIds },
        score: { not: null },
        sessionQuiz: { seniorityId },
      },
      _avg: {
        score: true,
      },
    });
    expect(result).toEqual([
      { subjectId: 1, averageScore: 70 },
      { subjectId: 2, averageScore: 80 },
    ]);
  });

  it("should return rounded score and handle null average", async () => {
    const repository = new SessionQuizSubjectPrismaRepository();
    prismaMock.sessionQuizSubject.groupBy.mockResolvedValue([
      {
        subjectId: 1,
        _avg: {
          score: 69.4,
        },
      },
      {
        subjectId: 2,
        _avg: {
          score: null,
        },
      },
    ]);

    const result = await repository.findAverageScoreByContext([1, 2], 3);

    expect(result).toEqual([
      { subjectId: 1, averageScore: 69 },
      { subjectId: 2, averageScore: 0 },
    ]);
  });
});
