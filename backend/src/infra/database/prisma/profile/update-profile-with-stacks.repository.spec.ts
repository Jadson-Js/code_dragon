import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { Profile } from "@/domain/entities/profile.entity";
import { NotFoundError } from "@/shared/app.error";

const prismaMockData = {
  $transaction: jest.fn<any>(),
};

jest.unstable_mockModule("../../../../../prisma/client", () => ({
  prisma: prismaMockData,
}));

const { UpdateProfileWithStacksPrismaRepository } = await import(
  "./update-profile-with-stacks.repository"
);

describe("UpdateProfileWithStacksPrismaRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const profileEntity = Profile.create({
    id: "prof-1",
    userId: "user-1",
    seniorityId: 2,
    specialtyId: 3,
  });

  const input = {
    profile: profileEntity,
    stacksId: [10, 11],
  };

  it("should update profile, refresh stacks and return mapped entity", async () => {
    const repository = new UpdateProfileWithStacksPrismaRepository();

    prismaMockData.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        profile: {
          update: jest.fn(async () => ({
            id: "prof-1",
            userId: "user-1",
            seniorityId: 2,
            specialtyId: 3,
            get toDomain(): Profile {
              return Profile.create(this as any);
            },
          })),
        },
        profileStack: {
          deleteMany: jest.fn(),
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

  it("should propagate transaction errors", async () => {
    const repository = new UpdateProfileWithStacksPrismaRepository();
    prismaMockData.$transaction.mockRejectedValue(new Error("Update failed"));

    await expect(repository.execute(input)).rejects.toThrow("Update failed");
  });

  it("should throw NotFoundError if profile is not found (P2025)", async () => {
    const repository = new UpdateProfileWithStacksPrismaRepository();

    prismaMockData.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        profile: {
          update: jest.fn(async () => {
            const error = new Error("Record not found");
            (error as any).code = "P2025";
            throw error;
          }),
        },
      };
      return await callback(tx);
    });

    await expect(repository.execute(input)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should re-throw generic Prisma errors", async () => {
    const repository = new UpdateProfileWithStacksPrismaRepository();

    prismaMockData.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        profile: {
          update: jest.fn(async () => {
            const error = new Error("Generic error");
            (error as any).code = "P9999";
            throw error;
          }),
        },
      };
      return await callback(tx);
    });

    await expect(repository.execute(input)).rejects.toThrow("Generic error");
  });
});
