import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { QuizObjective } from "@/domain/entities/quiz-objective.entity";
import { QuizSubject } from "@/domain/entities/quiz-subject.entity";
import { Seniority } from "@/domain/entities/seniority.entity";
import { Specialty } from "@/domain/entities/specialty.entity";
import { Stack } from "@/domain/entities/stack.entity";

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

const { QuizOptionsPrismaRepository } = await import(
  "./quiz-options.prisma.repository"
);

describe("QuizOptionsPrismaRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeRow = (id: number, name: string, entity: any) => ({
    id,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    description: "Description",
    get toDomain() {
      return entity.create(this as any);
    },
  });

  it("should call prisma.$transaction with the expected queries and return mapped domain entities", async () => {
    const repository = new QuizOptionsPrismaRepository();

    const mockResults = [
        [makeRow(1, "Pre-Onboarding", QuizObjective)],
        [makeRow(10, "React", QuizSubject)],
        [makeRow(2, "Junior", Seniority)],
        [makeRow(3, "Frontend", Specialty)],
        [makeRow(100, "TypeScript", Stack)],
    ];

    prismaMockData.$transaction.mockResolvedValue(mockResults);

    const result = await repository.execute();

    // Verify transaction was called
    expect(prismaMockData.$transaction).toHaveBeenCalledTimes(1);
    
    // Verify results are domain entities
    expect(result.quizObjectives[0]).toBeInstanceOf(QuizObjective);
    expect(result.quizSubjects[0]).toBeInstanceOf(QuizSubject);
    expect(result.seniorities[0]).toBeInstanceOf(Seniority);
    expect(result.specialties[0]).toBeInstanceOf(Specialty);
    expect(result.stacks[0]).toBeInstanceOf(Stack);

    // Verify IDs match
    expect(result.quizObjectives[0]!.id).toBe(1);
    expect(result.quizSubjects[0]!.id).toBe(10);
    expect(result.seniorities[0]!.id).toBe(2);
    expect(result.specialties[0]!.id).toBe(3);
    expect(result.stacks[0]!.id).toBe(100);
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
