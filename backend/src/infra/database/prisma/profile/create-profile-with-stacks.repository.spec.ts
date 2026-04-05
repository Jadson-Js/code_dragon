import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { Profile } from "@/domain/entities/profile.entity";
import { ConflictError, InternalServerError } from "@/shared/app.error";

const prismaMockData = {
  $transaction: jest.fn<any>(),
};

jest.unstable_mockModule("../../../../../prisma/client", () => ({
  prisma: prismaMockData,
}));

// Mocking PrismaClientKnownRequestError
class MockPrismaError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = "PrismaClientKnownRequestError";
  }
}

jest.unstable_mockModule("@prisma/client/runtime/client", () => ({
  PrismaClientKnownRequestError: MockPrismaError,
}));

const { CreateProfileWithStacksPrismaRepository } = await import(
  "./create-profile-with-stacks.repository"
);

describe("CreateProfileWithStacksPrismaRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const input = {
    userId: "user-1",
    ageRangeId: 1,
    seniorityId: 2,
    specialtyId: 3,
    careerObjectiveId: 4,
    stacksId: [10, 11],
  };

  it("should create profile, stacks and increment usageCount in a transaction", async () => {
    const repository = new CreateProfileWithStacksPrismaRepository();

    prismaMockData.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        profile: {
          create: jest.fn(async () => ({
            id: "prof-1",
            ...input,
            get toDomain() {
              return Profile.create(this as any);
            },
          })),
        },
        profileStack: {
          createMany: jest.fn(),
        },
        stack: {
          updateMany: jest.fn(),
        },
      };
      return callback(tx);
    });

    const result = await repository.execute(input);

    expect(prismaMockData.$transaction).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Profile);
    expect(result.id).toBe("prof-1");
  });

  it("should throw ConflictError when P2002 happens", async () => {
    const repository = new CreateProfileWithStacksPrismaRepository();
    prismaMockData.$transaction.mockRejectedValue(
      new MockPrismaError("Unique constraint failed", "P2002"),
    );

    await expect(repository.execute(input)).rejects.toBeInstanceOf(ConflictError);
  });

  it("should throw InternalServerError for other Prisma errors", async () => {
    const repository = new CreateProfileWithStacksPrismaRepository();
    prismaMockData.$transaction.mockRejectedValue(
      new MockPrismaError("Generic error", "P9999"),
    );

    await expect(repository.execute(input)).rejects.toBeInstanceOf(InternalServerError);
  });

  it("should throw InternalServerError for unknown errors", async () => {
    const repository = new CreateProfileWithStacksPrismaRepository();
    prismaMockData.$transaction.mockRejectedValue(new Error("Unknown"));

    await expect(repository.execute(input)).rejects.toBeInstanceOf(
      InternalServerError,
    );
  });
});
