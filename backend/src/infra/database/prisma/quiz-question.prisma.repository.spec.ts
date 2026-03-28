import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { QuizQuestion } from "@/domain/entities/quiz-question.entity";

const prismaMockData = {
  quizQuestion: {
    create: jest.fn<any>(),
    createManyAndReturn: jest.fn<any>(),
  },
};

jest.unstable_mockModule("../../../../prisma/client", () => ({
  prisma: prismaMockData,
}));

const { QuizQuestionPrismaRepository } = await import(
  "./quiz-question.prisma.repository"
);

describe("QuizQuestionPrismaRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeRaw = (id: number) => ({
    id,
    quizObjectiveId: 1,
    seniorityId: 2,
    specialtyId: 3,
    statement: "Q",
    alternatives: ["A"],
    correctAlternativeIndex: 0,
    code: null,
    reports: 0,
    get toDomain() {
      return QuizQuestion.create(this as any);
    },
  });

  it("should create a single question and return mapped entity", async () => {
    const repository = new QuizQuestionPrismaRepository();
    const entity = QuizQuestion.create({
      quizObjectiveId: 1,
      seniorityId: 2,
      specialtyId: 3,
      statement: "Q",
      alternatives: ["A"],
      correctAlternativeIndex: 0,
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
      quizObjectiveId: 1,
      seniorityId: 2,
      specialtyId: 3,
      statement: "Q",
      alternatives: ["A"],
      correctAlternativeIndex: 0,
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
});
