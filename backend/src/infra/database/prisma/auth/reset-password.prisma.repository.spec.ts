import "reflect-metadata";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { User } from "@/entities/user.entity";
import { InternalServerError } from "@/shared/app.error";

const prismaMock = {
  $transaction:
    jest.fn<
      (callback: (tx: unknown) => Promise<unknown>) => Promise<unknown>
    >(),
};

jest.unstable_mockModule("../../../../../prisma/client", () => ({
  prisma: prismaMock,
}));

let ResetPasswordPrismaRepository: {
  new (): { execute(user: User, tokenId: string): Promise<void> };
};

describe("ResetPasswordPrismaRepository", () => {
  beforeAll(async () => {
    ({ ResetPasswordPrismaRepository } =
      await import("./reset-password.prisma.repository"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update password and delete token in one transaction", async () => {
    const repository = new ResetPasswordPrismaRepository();
    const user = User.create({
      id: "user-1",
      name: "admin",
      email: "admin@admin.com",
      passwordHash: "new-hash",
      verifiedAt: new Date(),
      updatedAt: new Date(),
    });

    prismaMock.$transaction.mockImplementation(
      async (callback: (tx: unknown) => Promise<unknown>) => {
        const tx = {
          user: {
            update: jest.fn(async (_args: unknown) => undefined),
          },
          token: {
            delete: jest.fn(async (_args: unknown) => undefined),
          },
        };
        return callback(tx);
      },
    );

    await expect(repository.execute(user, "token-1")).resolves.toBeUndefined();
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
  });

  it("should throw InternalServerError when transaction fails", async () => {
    const repository = new ResetPasswordPrismaRepository();
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const user = User.create({
      id: "user-1",
      name: "admin",
      email: "admin@admin.com",
      passwordHash: "new-hash",
      verifiedAt: new Date(),
      updatedAt: new Date(),
    });

    prismaMock.$transaction.mockRejectedValue(new Error("db failure"));

    await expect(repository.execute(user, "token-1")).rejects.toBeInstanceOf(
      InternalServerError,
    );

    consoleErrorSpy.mockRestore();
  });
});
