import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { QuizQuestion } from "@/entities/quiz-question.entity";

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

  const makeRaw = (id: number) => ({
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
    get toDomain() {
      return QuizQuestion.create(this as any);
    },
  });

  it("should create a single question and return mapped entity", async () => {
    const repository = new QuizQuestionPrismaRepository();
    const entity = QuizQuestion.create({
      statement: "Q",
      alternatives: ["A"],
      correctAlternativeIndex: 0,
      sessionQuizId: "session-1",
      stackId: 1,
      subjectId: 2,
      seniorityId: 3,
      specialtyId: 4,
      objectiveId: 5,
    });

    prismaMockData.quizQuestion.create.mockResolvedValue(makeRaw(1));

    const result = await repository.create(entity);

    expect(result).toBeInstanceOf(QuizQuestion);
    expect(result.id).toBe(1);
    expect(prismaMockData.quizQuestion.create).toHaveBeenCalled();
  });

  it("should create multiple questions and return mapped entities", async () => {
    const repository = new QuizQuestionPrismaRepository();
    const entity = QuizQuestion.create({
      statement: "Q",
      alternatives: ["A"],
      correctAlternativeIndex: 0,
      sessionQuizId: "session-1",
      stackId: 1,
      subjectId: 2,
      seniorityId: 3,
      specialtyId: 4,
      objectiveId: 5,
    });

    prismaMockData.quizQuestion.createManyAndReturn.mockResolvedValue([
      makeRaw(10),
      makeRaw(11),
    ]);

    const result = await repository.createMany([entity, entity]);

    expect(result).toHaveLength(2);
    expect(result[0]!.id).toBe(10);
    expect(result[1]!.id).toBe(11);
    expect(prismaMockData.quizQuestion.createManyAndReturn).toHaveBeenCalled();
  });

  it("should find questions by session quiz id", async () => {
    const repository = new QuizQuestionPrismaRepository();
    const sessionQuizId = "session-1";

    prismaMockData.quizQuestion.findMany.mockResolvedValue([
      makeRaw(1),
      makeRaw(2),
    ]);

    const result = await repository.findBySessionQuizId(sessionQuizId);

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(QuizQuestion);
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
});
