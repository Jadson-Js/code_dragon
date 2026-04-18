import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
// Entity imports removed for simple vocabulary items
import { NotFoundError } from "@/shared/app.error";

const prismaMockData = {
  $transaction: jest.fn<any>(),
};

jest.unstable_mockModule("../../../../../../prisma/client", () => ({
  prisma: prismaMockData,
}));

const { GetQuizContextPrismaRepository } =
  await import("./get-quiz-context.prisma.repository");

describe("GetQuizContextPrismaRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeRow = (id: number) => ({
    id,
    name: "X",
    slug: "x",
    description: "desc",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const validData = {
    quizObjectiveId: 1,
    quizSubjectsId: [2],
    seniorityId: 3,
    specialtyId: 4,
    stacksId: [5],
  } as any;

  it("should return the full context mapped to domain when all items found", async () => {
    const repository = new GetQuizContextPrismaRepository();

    prismaMockData.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        quizObjective: {
          findUnique: jest.fn(async () => makeRow(1)),
        },
        quizSubject: {
          findMany: jest.fn(async () => [makeRow(2)]),
        },
        seniority: { findUnique: jest.fn(async () => makeRow(3)) },
        specialty: { findUnique: jest.fn(async () => makeRow(4)) },
        stack: { findMany: jest.fn(async () => [makeRow(5)]) },
      };
      return callback(tx);
    });

    const result = await repository.execute(validData);

    expect(result.quizObjective.id).toBe(1);
    expect(result.quizSubjects[0]!.id).toBe(2);
    expect(result.seniority.id).toBe(3);
    expect(result.specialty.id).toBe(4);
    expect(result.stacks[0]!.id).toBe(5);
  });

  it("should throw NotFoundError if quizObjective is missing", async () => {
    const repository = new GetQuizContextPrismaRepository();
    prismaMockData.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        quizObjective: { findUnique: jest.fn(async () => null) },
        quizSubject: {
          findMany: jest.fn(async () => [makeRow(2)]),
        },
        seniority: { findUnique: jest.fn(async () => makeRow(3)) },
        specialty: { findUnique: jest.fn(async () => makeRow(4)) },
        stack: { findMany: jest.fn(async () => [makeRow(5)]) },
      };
      return callback(tx);
    });

    await expect(repository.execute(validData)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("should throw NotFoundError if seniority is missing", async () => {
    const repository = new GetQuizContextPrismaRepository();
    prismaMockData.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        quizObjective: {
          findUnique: jest.fn(async () => makeRow(1)),
        },
        quizSubject: {
          findMany: jest.fn(async () => [makeRow(2)]),
        },
        seniority: { findUnique: jest.fn(async () => null) },
        specialty: { findUnique: jest.fn(async () => makeRow(4)) },
        stack: { findMany: jest.fn(async () => [makeRow(5)]) },
      };
      return callback(tx);
    });

    await expect(repository.execute(validData)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("should throw NotFoundError if specialty is missing", async () => {
    const repository = new GetQuizContextPrismaRepository();
    prismaMockData.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        quizObjective: {
          findUnique: jest.fn(async () => makeRow(1)),
        },
        quizSubject: {
          findMany: jest.fn(async () => [makeRow(2)]),
        },
        seniority: { findUnique: jest.fn(async () => makeRow(3)) },
        specialty: { findUnique: jest.fn(async () => null) },
        stack: { findMany: jest.fn(async () => [makeRow(5)]) },
      };
      return callback(tx);
    });

    await expect(repository.execute(validData)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("should throw NotFoundError if stacks are empty", async () => {
    const repository = new GetQuizContextPrismaRepository();
    prismaMockData.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        quizObjective: {
          findUnique: jest.fn(async () => makeRow(1)),
        },
        quizSubject: {
          findMany: jest.fn(async () => [makeRow(2)]),
        },
        seniority: { findUnique: jest.fn(async () => makeRow(3)) },
        specialty: { findUnique: jest.fn(async () => makeRow(4)) },
        stack: { findMany: jest.fn(async () => []) },
      };
      return callback(tx);
    });

    await expect(repository.execute(validData)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
