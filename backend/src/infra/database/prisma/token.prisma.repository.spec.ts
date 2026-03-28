import "reflect-metadata";
import { beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Token } from "@/domain/entities/token.entity";
import { InternalServerError } from "@/shared/app.error";

const prismaMock = {
  token: {
    create: jest.fn<(args: unknown) => Promise<unknown>>(),
    update: jest.fn<(args: unknown) => Promise<unknown>>(),
    delete: jest.fn<(args: unknown) => Promise<unknown>>(),
    findUnique: jest.fn<(args: unknown) => Promise<unknown | null>>(),
    findMany: jest.fn<(args?: unknown) => Promise<unknown[]>>(),
  },
  $transaction: jest.fn<
    (callback: (tx: unknown) => Promise<unknown>) => Promise<unknown>
  >(),
};

jest.unstable_mockModule("../../../../prisma/client", () => ({
  prisma: prismaMock,
}));

let TokenPrismaRepository: {
  new (): {
    create(data: Token): Promise<Token>;
    update(data: Token): Promise<Token>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Token | null>;
    findByUserId(userId: string): Promise<Token[]>;
    findAll(): Promise<Token[]>;
    deleteByUserIdAndCreateNewToken(userId: string, token: Token): Promise<void>;
  };
};

describe("TokenPrismaRepository", () => {
  beforeAll(async () => {
    ({ TokenPrismaRepository } = await import("./token.prisma.repository"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create should persist token and return mapped entity", async () => {
    const repository = new TokenPrismaRepository();
    const token = Token.create({
      id: "token-1",
      userId: "user-1",
      tokenHash: "hash",
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + 60_000),
    });
    prismaMock.token.create.mockResolvedValue({
      ...token,
      get toDomain() {
        return Token.create(this as any);
      },
    });

    const result = await repository.create(token);

    expect(prismaMock.token.create).toHaveBeenCalledWith({ data: token });
    expect(result).toBeInstanceOf(Token);
    expect(result.id).toBe("token-1");
  });

  it("findById should return null when token does not exist", async () => {
    const repository = new TokenPrismaRepository();
    prismaMock.token.findUnique.mockResolvedValue(null);

    const result = await repository.findById("missing");

    expect(result).toBeNull();
  });

  it("findByUserId should map returned token list", async () => {
    const repository = new TokenPrismaRepository();
    const now = new Date();
    prismaMock.token.findMany.mockResolvedValue([
      {
        id: "token-1",
        userId: "user-1",
        tokenHash: "hash-1",
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date(now.getTime() + 60_000),
        createdAt: now,
        updatedAt: now,
        get toDomain() {
          return Token.create(this as any);
        },
      },
    ]);

    const result = await repository.findByUserId("user-1");

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Token);
  });

  it("deleteByUserIdAndCreateNewToken should run transaction", async () => {
    const repository = new TokenPrismaRepository();
    const token = Token.create({
      id: "token-2",
      userId: "user-1",
      tokenHash: "hash-2",
      type: "PASSWORD_RESET",
      expiresAt: new Date(Date.now() + 60_000),
    });

    prismaMock.$transaction.mockImplementation(async (callback) => {
      const tx = {
        token: {
          deleteMany: jest.fn(async (_args: unknown) => undefined),
          create: jest.fn(async (_args: unknown) => undefined),
        },
      };
      return callback(tx);
    });

    await expect(
      repository.deleteByUserIdAndCreateNewToken("user-1", token),
    ).resolves.toBeUndefined();
  });

  it("deleteByUserIdAndCreateNewToken should throw InternalServerError on failure", async () => {
    const repository = new TokenPrismaRepository();
    const token = Token.create({
      id: "token-2",
      userId: "user-1",
      tokenHash: "hash-2",
      type: "PASSWORD_RESET",
      expiresAt: new Date(Date.now() + 60_000),
    });

    prismaMock.$transaction.mockRejectedValue(new Error("db error"));

    await expect(
      repository.deleteByUserIdAndCreateNewToken("user-1", token),
    ).rejects.toBeInstanceOf(InternalServerError);
  });
});
