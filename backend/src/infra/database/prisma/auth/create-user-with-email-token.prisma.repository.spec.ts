import "reflect-metadata";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { User } from "@/domain/entities/user.entity";
import { Token } from "@/domain/entities/token.entity";
import { ConflictError, InternalServerError } from "@/shared/app.error";

const prismaMock = {
  $transaction: jest.fn<any>(),
};

jest.unstable_mockModule("../../../../../prisma/client", () => ({
  prisma: prismaMock,
}));

const { CreateUserWithEmailTokenPrismaRepository } =
  await import("./create-user-with-email-token.prisma.repository");

describe("CreateUserWithEmailTokenPrismaRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create user and token in a transaction", async () => {
    const repository = new CreateUserWithEmailTokenPrismaRepository();
    const now = new Date();
    const user = User.create({
      id: "user-1",
      name: "admin",
      email: "admin@admin.com",
      passwordHash: "hash",
      verifiedAt: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
    const token = Token.create({
      id: "token-1",
      userId: "user-1",
      tokenHash: "token-hash",
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + 1000 * 60),
      createdAt: now,
      updatedAt: now,
    });

    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        user: {
          create: jest.fn(async (_args: unknown) => ({
            id: "user-1",
            name: "admin",
            email: "admin@admin.com",
            passwordHash: "hash",
            verifiedAt: null,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
          })),
        },
        token: {
          create: jest.fn(async (_args: unknown) => undefined),
        },
      };
      return callback(tx);
    });

    const output = await repository.execute(user, token);

    expect(output).toBeInstanceOf(User);
    expect(output.id).toBe("user-1");
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
  });

  it("should throw ConflictError when prisma returns P2002", async () => {
    const repository = new CreateUserWithEmailTokenPrismaRepository();
    const user = User.create({
      name: "admin",
      email: "admin@admin.com",
      passwordHash: "hash",
    });
    const token = Token.create({
      userId: user.id,
      tokenHash: "token-hash",
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + 1000 * 60),
    });

    prismaMock.$transaction.mockRejectedValue({ code: "P2002" });

    await expect(repository.execute(user, token)).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("should throw InternalServerError for unknown prisma errors", async () => {
    const repository = new CreateUserWithEmailTokenPrismaRepository();
    const user = User.create({
      name: "admin",
      email: "admin@admin.com",
      passwordHash: "hash",
    });
    const token = Token.create({
      userId: user.id,
      tokenHash: "token-hash",
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + 1000 * 60),
    });

    prismaMock.$transaction.mockRejectedValue(new Error("db down"));

    await expect(repository.execute(user, token)).rejects.toBeInstanceOf(
      InternalServerError,
    );
  });
});
