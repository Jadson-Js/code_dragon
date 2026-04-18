import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
// Entity imports removed for simple vocabulary items

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

const { GetOnboardingOptionsPrismaRepository } =
  await import("./get-onboarding-options.repository");

describe("GetOnboardingOptionsPrismaRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeRow = (id: number) => ({
    id,
    name: `X-${id}`,
    slug: `x-${id}`,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  it("should return onboarding options correctly mapped to domain", async () => {
    const repository = new GetOnboardingOptionsPrismaRepository();

    prismaMockData.$transaction.mockResolvedValue([
      [makeRow(1)],
      [makeRow(2)],
      [makeRow(3)],
      [makeRow(4)],
      [makeRow(5)],
    ]);

    const result = await repository.execute();

    expect(prismaMockData.$transaction).toHaveBeenCalledTimes(1);
    expect(result.seniorities).toHaveLength(1);
    expect(result.seniorities[0]!.id).toBe(1);
    expect(result.specialties[0]!.id).toBe(2);
    expect(result.careerObjectives[0]!.id).toBe(3);
    expect(result.ageRanges[0]!.id).toBe(4);
    expect(result.stacks[0]!.id).toBe(5);
  });

  it("should propagate transaction errors", async () => {
    const repository = new GetOnboardingOptionsPrismaRepository();
    prismaMockData.$transaction.mockRejectedValue(
      new Error("Transaction failed"),
    );

    await expect(repository.execute()).rejects.toThrow("Transaction failed");
  });
});
