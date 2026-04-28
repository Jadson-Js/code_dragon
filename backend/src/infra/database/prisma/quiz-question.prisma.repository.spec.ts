import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import type { QuizQuestion } from "generated/prisma/client";

const prismaMockData = {
  quizQuestion: {
    create: jest.fn<any>(),
    createManyAndReturn: jest.fn<any>(),
    findMany: jest.fn<any>(),
    count: jest.fn<any>(),
  },
};

jest.unstable_mockModule("../../../../prisma/client", () => ({
  prisma: prismaMockData,
}));

const { QuizQuestionPrismaRepository } =
  await import("./quiz-question.prisma.repository");

describe("QuizQuestionPrismaRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeRaw = (id: string) => ({
    id,
    statement: "Q",
    alternatives: ["A"],
    correctAlternativeIndex: 0,
    code: null,
    reports: 0,
    sessionQuizId: "session-1",
    stackId: 1,
    subjectId: 2,
    seniorityId: 3,
    specialtyId: 4,
    objectiveId: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  it("should create a single question and return entity", async () => {
    const repository = new QuizQuestionPrismaRepository();
    const data = {
      statement: "Q",
      alternatives: ["A"],
      correctAlternativeIndex: 0,
      sessionQuizId: "session-1",
      stackId: 1,
      subjectId: 2,
      seniorityId: 3,
      specialtyId: 4,
      objectiveId: 5,
    };

    prismaMockData.quizQuestion.create.mockResolvedValue(makeRaw("id-1"));

    const result = await repository.create(data as any);

    expect(result.id).toBe("id-1");
    expect(prismaMockData.quizQuestion.create).toHaveBeenCalled();
  });

  it("should create multiple questions and return entities", async () => {
    const repository = new QuizQuestionPrismaRepository();
    const data = {
      statement: "Q",
      alternatives: ["A"],
      correctAlternativeIndex: 0,
      sessionQuizId: "session-1",
      stackId: 1,
      subjectId: 2,
      seniorityId: 3,
      specialtyId: 4,
      objectiveId: 5,
    };

    prismaMockData.quizQuestion.createManyAndReturn.mockResolvedValue([
      makeRaw("id-10"),
      makeRaw("id-11"),
    ]);

    const result = await repository.createMany([data as any, data as any]);

    expect(result).toHaveLength(2);
    expect(result[0]!.id).toBe("id-10");
    expect(result[1]!.id).toBe("id-11");
    expect(prismaMockData.quizQuestion.createManyAndReturn).toHaveBeenCalled();
  });

  it("should find questions by session quiz id", async () => {
    const repository = new QuizQuestionPrismaRepository();
    const sessionQuizId = "session-1";

    prismaMockData.quizQuestion.findMany.mockResolvedValue([
      makeRaw("id-1"),
      makeRaw("id-2"),
    ]);

    const result = await repository.findBySessionQuizId(sessionQuizId);

    expect(result).toHaveLength(2);
    expect(result[0]!.id).toBe("id-1");
    expect(prismaMockData.quizQuestion.findMany).toHaveBeenCalledWith({
      where: { sessionQuizId },
    });
  });

  it("should count questions by session quiz id", async () => {
    const repository = new QuizQuestionPrismaRepository();
    const sessionQuizId = "session-1";

    prismaMockData.quizQuestion.count.mockResolvedValue(5);

    const result = await repository.countBySessionQuizId(sessionQuizId);

    expect(result).toBe(5);
    expect(prismaMockData.quizQuestion.count).toHaveBeenCalledWith({
      where: { sessionQuizId },
    });
  });

  it("should find questions by multiple ids", async () => {
    const repository = new QuizQuestionPrismaRepository();
    const ids = ["id-1", "id-2", "id-3"];

    prismaMockData.quizQuestion.findMany.mockResolvedValue([
      makeRaw("id-1"),
      makeRaw("id-2"),
      makeRaw("id-3"),
    ]);

    const result = await repository.findManyByIds(ids);

    expect(result).toHaveLength(3);
    expect(result[0]!.id).toBe("id-1");
    expect(result[1]!.id).toBe("id-2");
    expect(result[2]!.id).toBe("id-3");
    expect(prismaMockData.quizQuestion.findMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        stack: true,
        subject: true,
      },
    });
  });
});
