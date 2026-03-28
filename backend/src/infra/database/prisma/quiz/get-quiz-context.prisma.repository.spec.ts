import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { QuizObjective } from "@/domain/entities/quiz-objective.entity";
import { QuizSubject } from "@/domain/entities/quiz-subject.entity";
import { Seniority } from "@/domain/entities/seniority.entity";
import { Specialty } from "@/domain/entities/specialty.entity";
import { Stack } from "@/domain/entities/stack.entity";
import { NotFoundError } from "@/shared/app.error";

const prismaMockData = {
  $transaction: jest.fn<any>(),
};

jest.unstable_mockModule("../../../../../prisma/client", () => ({
  prisma: prismaMockData,
}));

const { GetQuizContextPrismaRepository } = await import(
  "./get-quiz-context.prisma.repository"
);

describe("GetQuizContextPrismaRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeRow = (id: number, entity: any) => ({
    id,
    name: "X",
    slug: "x",
    description: "desc",
    get toDomain() {
      return entity.create(this as any);
    },
  });

  const validData = {
    quizObjectiveId: 1,
    quizSubjectId: [2],
    seniorityId: 3,
    specialtyId: 4,
    stacksId: [5],
  } as any;

  it("should return the full context mapped to domain when all items found", async () => {
    const repository = new GetQuizContextPrismaRepository();

    prismaMockData.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        quizObjective: { findUnique: jest.fn(async () => makeRow(1, QuizObjective)) },
        quizSubject: { findMany: jest.fn(async () => [makeRow(2, QuizSubject)]) },
        seniority: { findUnique: jest.fn(async () => makeRow(3, Seniority)) },
        specialty: { findUnique: jest.fn(async () => makeRow(4, Specialty)) },
        stack: { findMany: jest.fn(async () => [makeRow(5, Stack)]) },
      };
      return callback(tx);
    });

    const result = await repository.execute(validData);

    expect(result.quizObjective).toBeInstanceOf(QuizObjective);
    expect(result.quizSubject[0]).toBeInstanceOf(QuizSubject);
    expect(result.seniority).toBeInstanceOf(Seniority);
    expect(result.specialty).toBeInstanceOf(Specialty);
    expect(result.stacks[0]).toBeInstanceOf(Stack);
  });

  it("should throw NotFoundError if quizObjective is missing", async () => {
    const repository = new GetQuizContextPrismaRepository();
    prismaMockData.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        quizObjective: { findUnique: jest.fn(async () => null) },
        quizSubject: { findMany: jest.fn(async () => [makeRow(2, QuizSubject)]) },
        seniority: { findUnique: jest.fn(async () => makeRow(3, Seniority)) },
        specialty: { findUnique: jest.fn(async () => makeRow(4, Specialty)) },
        stack: { findMany: jest.fn(async () => [makeRow(5, Stack)]) },
      };
      return callback(tx);
    });

    await expect(repository.execute(validData)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should throw NotFoundError if quizSubject is empty array", async () => {
    const repository = new GetQuizContextPrismaRepository();
    prismaMockData.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        quizObjective: { findUnique: jest.fn(async () => makeRow(1, QuizObjective)) },
        quizSubject: { findMany: jest.fn(async () => []) },
        seniority: { findUnique: jest.fn(async () => makeRow(3, Seniority)) },
        specialty: { findUnique: jest.fn(async () => makeRow(4, Specialty)) },
        stack: { findMany: jest.fn(async () => [makeRow(5, Stack)]) },
      };
      return callback(tx);
    });

    await expect(repository.execute(validData)).rejects.toBeInstanceOf(NotFoundError);
  });
});
