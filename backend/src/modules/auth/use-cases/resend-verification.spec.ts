import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { User } from "@/entities/user.entity";
import { ResendVerificationUseCase } from "./resend-verification";

function makeUser(verified = true): User {
  return User.create({
    id: "user-1",
    name: "admin",
    email: "admin@admin.com",
    passwordHash: "hashed-password",
    verifiedAt: verified ? new Date() : null,
  });
}

describe("ResendVerificationUseCase", () => {
  it("should skip when user is missing", async () => {
    const tokenRepository = {
      deleteByUserIdAndCreateNewToken: jest.fn<any>(),
    };
    const useCase = new ResendVerificationUseCase(
      { hash: jest.fn<any>() } as never,
      { findByEmail: jest.fn(async () => null) } as never,
      tokenRepository as never,
      { addJob: jest.fn<any>() } as never,
      { generateEmailVerificationToken: jest.fn<any>() } as never,
    );

    await useCase.execute({ email: "missing@admin.com" });
    expect(
      tokenRepository.deleteByUserIdAndCreateNewToken,
    ).not.toHaveBeenCalled();
  });

  it("should skip when user is already verified", async () => {
    const tokenRepository = {
      deleteByUserIdAndCreateNewToken: jest.fn<any>(),
    };
    const useCase = new ResendVerificationUseCase(
      {} as never,
      { findByEmail: jest.fn(async () => makeUser(true)) } as never,
      tokenRepository as never,
      {} as never,
      {} as never,
    );

    await useCase.execute({ email: "admin@admin.com" });
    expect(
      tokenRepository.deleteByUserIdAndCreateNewToken,
    ).not.toHaveBeenCalled();
  });

  it("should successfully generate new token and enqueue email", async () => {
    const tokenRepository = {
      deleteByUserIdAndCreateNewToken: jest.fn(async () => undefined),
    };
    const emailQueueProvider = { addJob: jest.fn(async () => undefined) };
    const jwtProvider = {
      generateEmailVerificationToken: jest.fn(async () => "new-token"),
    };

    const useCase = new ResendVerificationUseCase(
      { hash: jest.fn(async () => "new-hash") } as never,
      { findByEmail: jest.fn(async () => makeUser(false)) } as never,
      tokenRepository as never,
      emailQueueProvider as never,
      jwtProvider as never,
    );

    await useCase.execute({ email: "admin@admin.com" });

    expect(
      tokenRepository.deleteByUserIdAndCreateNewToken,
    ).toHaveBeenCalled();
    expect(emailQueueProvider.addJob).toHaveBeenCalled();
  });
});
