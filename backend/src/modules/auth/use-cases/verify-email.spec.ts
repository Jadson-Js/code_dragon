import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { User } from "@/entities/user.entity";
import { Token } from "@/entities/token.entity";
import { BadRequestError, NotFoundError } from "@/shared/app.error";
import { VerifyEmailUseCase } from "./verify-email";

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

describe("VerifyEmailUseCase", () => {
  it("should throw BadRequestError for invalid token signature", async () => {
    const useCase = new VerifyEmailUseCase(
      { verifyEmailVerificationToken: jest.fn(async () => false) } as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await expect(
      useCase.execute({ token: "invalid" }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it("should throw NotFoundError when user is missing", async () => {
    const useCase = new VerifyEmailUseCase(
      {
        verifyEmailVerificationToken: jest.fn(async () => true),
        decodeToken: jest.fn(async () => ({ sub: "missing" })),
      } as never,
      {} as never,
      { findById: jest.fn(async () => null) } as never,
      {} as never,
    );

    await expect(useCase.execute({ token: "valid" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("should throw BadRequestError and correct message when token is missing in repository", async () => {
    const useCase = new VerifyEmailUseCase(
      {
        verifyEmailVerificationToken: jest.fn(async () => true),
        decodeToken: jest.fn(async () => ({ sub: "user-1" })),
      } as never,
      {} as never,
      { findById: jest.fn(async () => makeUser(false)) } as never,
      { findByUserId: jest.fn(async () => []) } as never,
    );

    await expect(useCase.execute({ token: "valid" })).rejects.toThrow(
      "Token not found or invalid",
    );
  });

  it("should throw BadRequestError when token hash does not match", async () => {
    const useCase = new VerifyEmailUseCase(
      {
        verifyEmailVerificationToken: jest.fn(async () => true),
        decodeToken: jest.fn(async () => ({ sub: "user-1" })),
      } as never,
      { compare: jest.fn(async () => false) } as never,
      { findById: jest.fn(async () => makeUser(false)) } as never,
      {
        findByUserId: jest.fn(async () => [makeToken("EMAIL_VERIFICATION")]),
      } as never,
    );

    await expect(useCase.execute({ token: "wrong-content" })).rejects.toThrow(
      "Token not found or invalid",
    );
  });

  it("should throw BadRequestError when email is already verified", async () => {
    const useCase = new VerifyEmailUseCase(
      {
        verifyEmailVerificationToken: jest.fn(async () => true),
        decodeToken: jest.fn(async () => ({ sub: "user-1" })),
      } as never,
      {} as never,
      { findById: jest.fn(async () => makeUser(true)) } as never,
      {} as never,
    );

    await expect(useCase.execute({ token: "valid" })).rejects.toThrow(
      "Email already verified",
    );
  });

  it("should throw BadRequestError when token has expired", async () => {
    const expiredToken = makeToken("EMAIL_VERIFICATION");
    jest.spyOn(expiredToken, "isExpired").mockReturnValue(true);

    const useCase = new VerifyEmailUseCase(
      {
        verifyEmailVerificationToken: jest.fn(async () => true),
        decodeToken: jest.fn(async () => ({ sub: "user-1" })),
      } as never,
      { compare: jest.fn(async () => true) } as never,
      { findById: jest.fn(async () => makeUser(false)) } as never,
      { findByUserId: jest.fn(async () => [expiredToken]) } as never,
    );

    await expect(useCase.execute({ token: "valid" })).rejects.toThrow(
      "Token has expired",
    );
  });

  it("should verify user and delete token", async () => {
    const userRepository = {
      findById: jest.fn<any>(),
      update: jest.fn<any>(),
    };
    const tokenRepository = {
      findByUserId: jest.fn<any>(),
      delete: jest.fn<any>(),
    };

    userRepository.findById.mockResolvedValue(makeUser(false));
    tokenRepository.findByUserId.mockResolvedValue([
      makeToken("EMAIL_VERIFICATION"),
    ]);

    const useCase = new VerifyEmailUseCase(
      {
        verifyEmailVerificationToken: jest.fn(async () => true),
        decodeToken: jest.fn(async () => ({ sub: "user-1" })),
      } as never,
      { compare: jest.fn(async () => true) } as never,
      userRepository as never,
      tokenRepository as never,
    );

    await useCase.execute({ token: "valid-token" });

    expect(userRepository.update).toHaveBeenCalledTimes(1);
    expect(tokenRepository.delete).toHaveBeenCalledWith("token-1");
  });
});
