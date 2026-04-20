import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { User } from "@/entities/user.entity";
import { Token } from "@/entities/token.entity";
import { BadRequestError, NotFoundError } from "@/shared/app.error";
import { ResetPasswordUseCase } from "./reset-password";

function makeUser(verified = true): User {
  return User.create({
    id: "user-1",
    name: "admin",
    email: "admin@admin.com",
    passwordHash: "hashed-password",
    verifiedAt: verified ? new Date() : null,
  });
}

function makeToken(type: "EMAIL_VERIFICATION" | "PASSWORD_RESET"): Token {
  return Token.create({
    id: "token-1",
    userId: "user-1",
    tokenHash: "hashed-token",
    type,
    expiresAt: new Date(Date.now() + 60_000),
  });
}

describe("ResetPasswordUseCase", () => {
  it("should throw BadRequestError for invalid token signature", async () => {
    const useCase = new ResetPasswordUseCase(
      { verifyPasswordResetToken: jest.fn(async () => false) } as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await expect(
      useCase.execute({ token: "bad", password: "123" }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it("should throw NotFoundError when user is missing", async () => {
    const useCase = new ResetPasswordUseCase(
      {
        verifyPasswordResetToken: jest.fn(async () => true),
        decodeToken: jest.fn(async () => ({ sub: "missing" })),
      } as never,
      {} as never,
      { findById: jest.fn(async () => null) } as never,
      {} as never,
      {} as never,
    );

    await expect(
      useCase.execute({ token: "valid", password: "123" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should throw BadRequestError and correct message when token is missing in repository", async () => {
    const useCase = new ResetPasswordUseCase(
      {
        verifyPasswordResetToken: jest.fn(async () => true),
        decodeToken: jest.fn(async () => ({ sub: "user-1" })),
      } as never,
      {} as never,
      { findById: jest.fn(async () => makeUser(true)) } as never,
      { findByUserId: jest.fn(async () => []) } as never,
      {} as never,
    );

    await expect(
      useCase.execute({ token: "valid", password: "123" }),
    ).rejects.toThrow("Token not found or invalid");
  });

  it("should throw BadRequestError when user is not verified", async () => {
    const useCase = new ResetPasswordUseCase(
      {
        verifyPasswordResetToken: jest.fn(async () => true),
        decodeToken: jest.fn(async () => ({ sub: "user-1" })),
      } as never,
      {} as never,
      { findById: jest.fn(async () => makeUser(false)) } as never,
      {} as never,
      {} as never,
    );

    await expect(
      useCase.execute({ token: "valid", password: "123" }),
    ).rejects.toThrow("User is not verified");
  });

  it("should throw BadRequestError when token has expired", async () => {
    const expiredToken = makeToken("PASSWORD_RESET");
    jest.spyOn(expiredToken, "isExpired").mockReturnValue(true);

    const useCase = new ResetPasswordUseCase(
      {
        verifyPasswordResetToken: jest.fn(async () => true),
        decodeToken: jest.fn(async () => ({ sub: "user-1" })),
      } as never,
      { compare: jest.fn(async () => true) } as never,
      { findById: jest.fn(async () => makeUser(true)) } as never,
      { findByUserId: jest.fn(async () => [expiredToken]) } as never,
      {} as never,
    );

    await expect(
      useCase.execute({ token: "valid", password: "123" }),
    ).rejects.toThrow("Token has expired");
  });

  it("should update password and consume token", async () => {
    const resetPasswordRepository = { execute: jest.fn<any>() };
    const token = makeToken("PASSWORD_RESET");
    const user = makeUser(true);

    const useCase = new ResetPasswordUseCase(
      {
        verifyPasswordResetToken: jest.fn(async () => true),
        decodeToken: jest.fn(async () => ({ sub: "user-1" })),
      } as never,
      {
        compare: jest.fn(async () => true),
        hash: jest.fn(async () => "new-hash"),
      } as never,
      { findById: jest.fn(async () => user) } as never,
      { findByUserId: jest.fn(async () => [token]) } as never,
      resetPasswordRepository as never,
    );

    await useCase.execute({ token: "valid", password: "new-password-123" });

    expect(resetPasswordRepository.execute).toHaveBeenCalledTimes(1);
    expect(resetPasswordRepository.execute).toHaveBeenCalledWith(
      expect.objectContaining({ id: "user-1", passwordHash: "new-hash" }),
      "token-1",
    );
  });
});
