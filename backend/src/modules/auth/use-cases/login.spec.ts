import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { User } from "@/entities/user.entity";
import { LoginUseCase } from "./login";
import { NotFoundError } from "@/shared/app.error";

function makeUser(verified = true): User {
  return User.create({
    id: "user-1",
    name: "admin",
    email: "admin@admin.com",
    passwordHash: "hashed-password",
    verifiedAt: verified ? new Date() : null,
  });
}

describe("LoginUseCase", () => {
  it("should throw NotFoundError for missing user", async () => {
    const useCase = new LoginUseCase(
      { findByEmail: jest.fn(async () => null) } as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await expect(
      useCase.execute({ email: "missing@admin.com", password: "123" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should throw NotFoundError and incorrect message for security when password invalid", async () => {
    const useCase = new LoginUseCase(
      { findByEmail: jest.fn(async () => makeUser(true)) } as never,
      { compare: jest.fn(async () => false) } as never,
      {} as never,
      {} as never,
    );

    await expect(
      useCase.execute({ email: "admin@admin.com", password: "wrong" }),
    ).rejects.toThrow("User not found");
  });

  it("should throw UnauthorizedError when user is not verified", async () => {
    const useCase = new LoginUseCase(
      { findByEmail: jest.fn(async () => makeUser(false)) } as never,
      { compare: jest.fn(async () => true) } as never,
      {} as never,
      {} as never,
    );

    await expect(
      useCase.execute({ email: "admin@admin.com", password: "password" }),
    ).rejects.toThrow("User not verified");
  });

  it("should return tokens and persist session", async () => {
    const redisProvider = { set: jest.fn<any>() };
    const user = makeUser(true);

    const useCase = new LoginUseCase(
      { findByEmail: jest.fn(async () => user) } as never,
      { compare: jest.fn(async () => true) } as never,
      {
        generateAccessToken: jest.fn(async () => "access-token"),
        generateRefreshToken: jest.fn(async () => "refresh-token"),
      } as never,
      redisProvider as never,
    );

    const output = await useCase.execute({
      email: "admin@admin.com",
      password: "123",
    });

    expect(output.accessToken).toBe("access-token");
    expect(output.refreshToken).toBe("refresh-token");
    expect(redisProvider.set).toHaveBeenCalledTimes(1);
  });
});
