import "reflect-metadata";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { User } from "@/domain/entities/user.entity";
import { ConflictError } from "@/shared/app.error";

const prismaMock = {
  user: {
    create: jest.fn<any>(),
    update: jest.fn<any>(),
    delete: jest.fn<any>(),
    findUnique: jest.fn<any>(),
    findMany: jest.fn<any>(),
  },
};

jest.unstable_mockModule("../../../../prisma/client", () => ({
  prisma: prismaMock,
}));

let UserPrismaRepository: {
  new (): {
    create(data: User): Promise<User>;
    update(data: User): Promise<User>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
  };
};

describe("UserPrismaRepository", () => {
  beforeAll(async () => {
    ({ UserPrismaRepository } = await import("./user.prisma.repository"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create should persist and return mapped user", async () => {
    const repository = new UserPrismaRepository();
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

    prismaMock.user.create.mockResolvedValue({
      id: "user-1",
      name: "admin",
      email: "admin@admin.com",
      passwordHash: "hash",
      verifiedAt: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      get toDomain() {
        return User.create(this as any);
      },
    });

    const result = await repository.create(user);

    expect(prismaMock.user.create).toHaveBeenCalledWith({ data: user });
    expect(result).toBeInstanceOf(User);
    expect(result.email).toBe("admin@admin.com");
  });

  it("create should map P2002 to ConflictError", async () => {
    const repository = new UserPrismaRepository();
    const user = User.create({
      name: "admin",
      email: "admin@admin.com",
      passwordHash: "hash",
    });

    prismaMock.user.create.mockRejectedValue({ code: "P2002" });

    await expect(repository.create(user)).rejects.toBeInstanceOf(ConflictError);
  });

  it("create should rethrow unknown errors", async () => {
    const repository = new UserPrismaRepository();
    const user = User.create({
      name: "admin",
      email: "admin@admin.com",
      passwordHash: "hash",
    });

    prismaMock.user.create.mockRejectedValue(new Error("Generic DB error"));

    await expect(repository.create(user)).rejects.toThrow("Generic DB error");
  });

  it("update should persist and return mapped user", async () => {
    const repository = new UserPrismaRepository();
    const now = new Date();
    const user = User.create({
      id: "user-1",
      name: "updated",
      email: "admin@admin.com",
      passwordHash: "hash",
    });

    prismaMock.user.update.mockResolvedValue({
      id: "user-1",
      name: "updated",
      email: "admin@admin.com",
      passwordHash: "hash",
      verifiedAt: now,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      get toDomain() {
        return User.create(this as any);
      },
    });

    const result = await repository.update(user);

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: user,
    });
    expect(result.name).toBe("updated");
  });

  it("delete should remove user from database", async () => {
    const repository = new UserPrismaRepository();
    prismaMock.user.delete.mockResolvedValue({ id: "user-1" });

    await repository.delete("user-1");

    expect(prismaMock.user.delete).toHaveBeenCalledWith({
      where: { id: "user-1" },
    });
  });

  it("findByEmail should return mapped user", async () => {
    const repository = new UserPrismaRepository();
    const now = new Date();
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-1",
      name: "admin",
      email: "admin@admin.com",
      passwordHash: "hash",
      verifiedAt: now,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      get toDomain() {
        return User.create(this as any);
      },
    });

    const result = await repository.findByEmail("admin@admin.com");

    expect(result).toBeInstanceOf(User);
    expect(result?.isVerified()).toBe(true);
  });

  it("findById should return null when user does not exist", async () => {
    const repository = new UserPrismaRepository();
    prismaMock.user.findUnique.mockResolvedValue(null);

    const result = await repository.findById("missing");

    expect(result).toBeNull();
  });

  it("findAll should map user list", async () => {
    const repository = new UserPrismaRepository();
    const now = new Date();
    prismaMock.user.findMany.mockResolvedValue([
      {
        id: "user-1",
        name: "admin",
        email: "admin@admin.com",
        passwordHash: "hash",
        verifiedAt: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        get toDomain() {
          return User.create(this as any);
        },
      },
    ]);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(User);
  });
});
