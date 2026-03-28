import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { Seniority } from "@/domain/entities/seniority.entity";
import { Specialty } from "@/domain/entities/specialty.entity";
import { CareerObjective } from "@/domain/entities/career-objective.entity";
import { AgeRange } from "@/domain/entities/age-range.entity";
import { Stack } from "@/domain/entities/stack.entity";

const prismaMockData = {
  $transaction: jest.fn<any>(),
  seniority: { findMany: jest.fn() },
  specialty: { findMany: jest.fn() },
  careerObjective: { findMany: jest.fn() },
  ageRange: { findMany: jest.fn() },
  stack: { findMany: jest.fn() },
};

jest.unstable_mockModule("../../../../../prisma/client", () => ({
  prisma: prismaMockData,
}));

const { GetOnboardingOptionsPrismaRepository } = await import(
  "./get-onboarding-options.repository"
);

describe("GetOnboardingOptionsPrismaRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeRow = (id: number, entity: any) => ({
    id,
    name: `X-${id}`,
    slug: `x-${id}`,
    order: 1,
    get toDomain() {
      return entity.create(this as any);
    },
  });

  it("should return onboarding options correctly mapped to domain", async () => {
    const repository = new GetOnboardingOptionsPrismaRepository();

    prismaMockData.$transaction.mockResolvedValue([
      [makeRow(1, Seniority)],
      [makeRow(2, Specialty)],
      [makeRow(3, CareerObjective)],
      [makeRow(4, AgeRange)],
      [makeRow(5, Stack)],
    ]);

    const result = await repository.execute();

    expect(prismaMockData.$transaction).toHaveBeenCalledTimes(1);
    expect(result.seniorities).toHaveLength(1);
    expect(result.seniorities[0]).toBeInstanceOf(Seniority);
    expect(result.specialties[0]).toBeInstanceOf(Specialty);
    expect(result.careerObjectives[0]).toBeInstanceOf(CareerObjective);
    expect(result.ageRanges[0]).toBeInstanceOf(AgeRange);
    expect(result.stacks[0]).toBeInstanceOf(Stack);
  });

  it("should propagate transaction errors", async () => {
    const repository = new GetOnboardingOptionsPrismaRepository();
    prismaMockData.$transaction.mockRejectedValue(new Error("Transaction failed"));

    await expect(repository.execute()).rejects.toThrow("Transaction failed");
  });
});
