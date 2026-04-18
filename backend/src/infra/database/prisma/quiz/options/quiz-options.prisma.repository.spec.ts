import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
// Entity imports removed for simple vocabulary items

// ─── Helpers ─────────────────────────────────────────────────────────────────

const prismaMockData = {
  $transaction: jest.fn<any>(),
  quizObjective: { findMany: jest.fn() },
  quizSubject: { findMany: jest.fn() },
  seniority: { findMany: jest.fn() },
  specialty: { findMany: jest.fn() },
  stack: { findMany: jest.fn() },
};

// We must mock the prisma client using the project's absolute path to avoid directory depth issues
jest.unstable_mockModule("../../../../../../prisma/client", () => ({
  prisma: prismaMockData,
}));

const { QuizOptionsPrismaRepository } =
  await import("./quiz-options.prisma.repository");

describe("QuizOptionsPrismaRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeRow = (id: number, name: string, extras: any = {}) => ({
    id,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    description: "Description",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...extras,
  });

  it("should call prisma.$transaction with the expected queries and return mapped domain entities", async () => {
    const repository = new QuizOptionsPrismaRepository();

    const mockResults = [
      [makeRow(1, "Pre-Onboarding")],
      [makeRow(10, "React", { specialties: [] })],
      [makeRow(2, "Junior")],
      [makeRow(3, "Frontend")],
      [makeRow(100, "TypeScript")],
    ];

    prismaMockData.$transaction.mockResolvedValue(mockResults);

    const result = await repository.execute();

    // Verify transaction was called
    expect(prismaMockData.$transaction).toHaveBeenCalledTimes(1);

    // Verify results have correct IDs
    expect(result.quizObjectives[0]!.id).toBe(1);
    expect(result.quizSubjects[0]!.id).toBe(10);
    expect(result.seniorities[0]!.id).toBe(2);
    expect(result.specialties[0]!.id).toBe(3);
    expect(result.stacks[0]!.id).toBe(100);

    expect(result.specialties[0]!.id).toBe(3);
    expect(result.stacks[0]!.id).toBe(100);
  });

  it("should map specialty subjects when present", async () => {
    const repository = new QuizOptionsPrismaRepository();

    const mockResults = [
      [],
      [],
      [],
      [
        {
          id: 1,
          name: "Frontend",
          order: 1,
          slug: "frontend",
          description: "desc",
          createdAt: new Date(),
          updatedAt: new Date(),
          quizSubjects: [
            {
              quizSubject: makeRow(10, "React"),
            },
          ],
        },
      ],
      [],
    ];

    prismaMockData.$transaction.mockResolvedValue(mockResults);

    const result = await repository.execute();

    expect(result.specialties[0]).toBeDefined();
    expect((result.specialties[0] as any).subjects).toHaveLength(1);
    expect((result.specialties[0] as any).subjects[0].name).toBe("React");
  });

  it("should return empty arrays when transaction returns no data", async () => {
    const repository = new QuizOptionsPrismaRepository();

    prismaMockData.$transaction.mockResolvedValue([[], [], [], [], []]);

    const result = await repository.execute();

    expect(result.quizObjectives).toHaveLength(0);
    expect(result.quizSubjects).toHaveLength(0);
    expect(result.seniorities).toHaveLength(0);
    expect(result.specialties).toHaveLength(0);
    expect(result.stacks).toHaveLength(0);
  });

  it("should propagate errors thrown by the transaction", async () => {
    const repository = new QuizOptionsPrismaRepository();

    prismaMockData.$transaction.mockRejectedValue(new Error("Prisma error"));

    await expect(repository.execute()).rejects.toThrow("Prisma error");
  });
});
