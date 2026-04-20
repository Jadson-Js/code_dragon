import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { User } from "@/entities/user.entity";
import { SignupUseCase } from "./signup";

function makeUser(verified = true): User {
  return User.create({
    id: "user-1",
    name: "admin",
    email: "admin@admin.com",
    passwordHash: "hashed-password",
    verifiedAt: verified ? new Date() : null,
  });
}

describe("SignupUseCase", () => {
  it("should stop when email already exists", async () => {
    const hashProvider = { hash: jest.fn<any>() };
    const createUserWithEmailTokenRepository = { execute: jest.fn<any>() };
    const userRepository = { findByEmail: jest.fn<any>() };
    const jwtProvider = { generateEmailVerificationToken: jest.fn<any>() };
    const emailQueueProvider = { addJob: jest.fn<any>() };

    userRepository.findByEmail.mockResolvedValue(makeUser(true));

    const useCase = new SignupUseCase(
      hashProvider as never,
      createUserWithEmailTokenRepository as never,
      userRepository as never,
      jwtProvider as never,
      emailQueueProvider as never,
    );

    await useCase.execute({
      name: "admin",
      email: "admin@admin.com",
      password: "12345678",
    });

    expect(hashProvider.hash).not.toHaveBeenCalled();
  });

  it("should create user and enqueue verification email", async () => {
    const hashProvider = { hash: jest.fn<any>() };
    const createUserWithEmailTokenRepository = { execute: jest.fn<any>() };
    const userRepository = { findByEmail: jest.fn<any>() };
    const jwtProvider = { generateEmailVerificationToken: jest.fn<any>() };
    const emailQueueProvider = { addJob: jest.fn<any>() };

    userRepository.findByEmail.mockResolvedValue(null);
    hashProvider.hash
      .mockResolvedValueOnce("hashed-password")
      .mockResolvedValueOnce("hashed-email-token");
    jwtProvider.generateEmailVerificationToken.mockResolvedValue(
      "email-token",
    );

    const useCase = new SignupUseCase(
      hashProvider as never,
      createUserWithEmailTokenRepository as never,
      userRepository as never,
      jwtProvider as never,
      emailQueueProvider as never,
    );

    await useCase.execute({
      name: "admin",
      email: "admin@admin.com",
      password: "12345678",
    });

    expect(createUserWithEmailTokenRepository.execute).toHaveBeenCalledTimes(1);
    expect(emailQueueProvider.addJob).toHaveBeenCalledTimes(1);
  });
});
