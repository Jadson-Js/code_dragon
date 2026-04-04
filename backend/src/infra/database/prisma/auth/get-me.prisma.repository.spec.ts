import "reflect-metadata";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { User } from "@/domain/entities/user.entity";
import { Profile } from "@/domain/entities/profile.entity";

const prismaMock = {
  $transaction: jest.fn<any>(),
};

jest.unstable_mockModule("../../../../../prisma/client", () => ({
  prisma: prismaMock,
}));

const { GetMePrismaRepository } = await import("./get-me.prisma.repository");

describe("GetMePrismaRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user and profile when both exist", async () => {
    const repository = new GetMePrismaRepository();
    const now = new Date();

    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        user: {
          findUnique: jest.fn(async (_args: unknown) => ({
            id: "user-1",
            name: "admin",
            email: "admin@admin.com",
            passwordHash: "hash",
            verifiedAt: now,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            get toDomain(): User {
              return User.create(this as any);
            },
          })),
        },
        profile: {
          findUnique: jest.fn(async (_args: unknown) => ({
            id: "profile-1",
            userId: "user-1",
            linkedinUrl: null,
            githubUrl: null,
            portfolioUrl: null,
            ageRangeId: 1,
            seniorityId: 2,
            specialtyId: 3,
            careerObjectiveId: 4,
            createdAt: now,
            updatedAt: now,
            get toDomain(): Profile {
              return Profile.create(this as any);
            },
          })),
        },
      };
      return callback(tx);
    });

    const output = await repository.execute("user-1");

    expect(output).not.toBeNull();
    expect(output?.user).toBeInstanceOf(User);
    expect(output?.profile?.id).toBe("profile-1");
  });

  it("should return profile null when profile does not exist", async () => {
    const repository = new GetMePrismaRepository();
    const now = new Date();

    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        user: {
          findUnique: jest.fn(async (_args: unknown) => ({
            id: "user-1",
            name: "admin",
            email: "admin@admin.com",
            passwordHash: "hash",
            verifiedAt: now,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            get toDomain(): User {
              return User.create(this as any);
            },
          })),
        },
        profile: {
          findUnique: jest.fn(async (_args: unknown) => null),
        },
      };
      return callback(tx);
    });

    const output = await repository.execute("user-1");

    expect(output).not.toBeNull();
    expect(output?.profile).toBeNull();
  });

  it("should return null when user does not exist", async () => {
    const repository = new GetMePrismaRepository();

    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        user: {
          findUnique: jest.fn(async (_args: unknown) => null),
        },
        profile: {
          findUnique: jest.fn(async (_args: unknown) => null),
        },
      };
      return callback(tx);
    });

    const output = await repository.execute("missing-user");

    expect(output).toBeNull();
  });
});
