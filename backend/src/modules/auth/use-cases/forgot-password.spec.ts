import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { User } from "@/entities/user.entity";
import { ForgotPasswordUseCase } from "./forgot-password";

function makeUser(verified = true): User {
  return User.create({
    id: "user-1",
    name: "admin",
    email: "admin@admin.com",
    passwordHash: "hashed-password",
    verifiedAt: verified ? new Date() : null,
  });
}

describe("ForgotPasswordUseCase", () => {
  it("should skip when user is unverified", async () => {
    const tokenRepository = {
      deleteByUserIdAndCreateNewToken: jest.fn<any>(),
    };
    const useCase = new ForgotPasswordUseCase(
      {} as never,
      { findByEmail: jest.fn(async () => makeUser(false)) } as never,
      tokenRepository as never,
      {} as never,
      {} as never,
    );

    await useCase.execute({ email: "admin@admin.com" });
    expect(
      tokenRepository.deleteByUserIdAndCreateNewToken,
    ).not.toHaveBeenCalled();
  });

  it("should skip when user is missing", async () => {
    const tokenRepository = {
      deleteByUserIdAndCreateNewToken: jest.fn<any>(),
    };
    const useCase = new ForgotPasswordUseCase(
      {} as never,
      { findByEmail: jest.fn(async () => null) } as never,
      tokenRepository as never,
      {} as never,
      {} as never,
    );

    await useCase.execute({ email: "missing@admin.com" });
    expect(
      tokenRepository.deleteByUserIdAndCreateNewToken,
    ).not.toHaveBeenCalled();
  });

  it("should successfully generate token and enqueue email", async () => {
    const tokenRepository = {
      deleteByUserIdAndCreateNewToken: jest.fn(async () => undefined),
    };
    const emailQueueProvider = { addJob: jest.fn(async () => undefined) };

    const useCase = new ForgotPasswordUseCase(
      { hash: jest.fn(async () => "hash") } as never,
      { findByEmail: jest.fn(async () => makeUser(true)) } as never,
      tokenRepository as never,
      emailQueueProvider as never,
      { generatePasswordResetToken: jest.fn(async () => "token") } as never,
    );

    await useCase.execute({ email: "admin@admin.com" });

    expect(
      tokenRepository.deleteByUserIdAndCreateNewToken,
    ).toHaveBeenCalled();
    expect(emailQueueProvider.addJob).toHaveBeenCalled();
  });
});
