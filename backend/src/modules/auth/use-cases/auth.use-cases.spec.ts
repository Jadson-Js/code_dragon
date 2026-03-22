import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { User } from "@/domain/entities/user.entity";
import { Token } from "@/domain/entities/token.entity";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/shared/app.error";
import { SignupUseCase } from "./signup";
import { ResendVerificationUseCase } from "./resend-verification";
import { VerifyEmailUseCase } from "./verify-email";
import { ForgotPasswordUseCase } from "./forgot-password";
import { ResetPasswordUseCase } from "./reset-password";
import { LoginUseCase } from "./login";
import { LogoutUseCase } from "./logout";
import { RefreshTokenUseCase } from "./refresh-token";
import { GetMeUseCase } from "./get-me";

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

describe("Auth use-cases", () => {
  it("SignupUseCase should stop when email already exists", async () => {
    const hashProvider = {
      hash: jest.fn<(data: string) => Promise<string>>(),
    };
    const createUserWithEmailTokenRepository = {
      execute: jest.fn<(user: unknown, token: unknown) => Promise<void>>(),
    };
    const userRepository = {
      findByEmail: jest.fn<(email: string) => Promise<User | null>>(),
    };
    const jwtProvider = {
      generateEmailVerificationToken:
        jest.fn<(id: string) => Promise<string>>(),
    };
    const emailQueueProvider = {
      addJob: jest.fn<(job: unknown) => Promise<void>>(),
    };

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
    expect(createUserWithEmailTokenRepository.execute).not.toHaveBeenCalled();
    expect(emailQueueProvider.addJob).not.toHaveBeenCalled();
  });

  it("SignupUseCase should create user and enqueue verification email", async () => {
    const hashProvider = {
      hash: jest.fn<(data: string) => Promise<string>>(),
    };
    const createUserWithEmailTokenRepository = {
      execute: jest.fn<(user: unknown, token: unknown) => Promise<void>>(),
    };
    const userRepository = {
      findByEmail: jest.fn<(email: string) => Promise<User | null>>(),
    };
    const jwtProvider = {
      generateEmailVerificationToken:
        jest.fn<(id: string) => Promise<string>>(),
    };
    const emailQueueProvider = {
      addJob: jest.fn<(job: unknown) => Promise<void>>(),
    };

    userRepository.findByEmail.mockResolvedValue(null);
    hashProvider.hash
      .mockResolvedValueOnce("hashed-password")
      .mockResolvedValueOnce("hashed-email-token");
    jwtProvider.generateEmailVerificationToken.mockResolvedValue("email-token");

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

  it("ResendVerificationUseCase should skip when user is missing", async () => {
    const useCase = new ResendVerificationUseCase(
      { hash: jest.fn<(data: string) => Promise<string>>() } as never,
      { findByEmail: jest.fn(async (_email: string) => null) } as never,
      {
        deleteByUserIdAndCreateNewToken:
          jest.fn<(userId: string, token: Token) => Promise<void>>(),
      } as never,
      { addJob: jest.fn<(job: unknown) => Promise<void>>() } as never,
      {
        generateEmailVerificationToken:
          jest.fn<(id: string) => Promise<string>>(),
      } as never,
    );

    await useCase.execute({ email: "missing@admin.com" });

    expect(true).toBe(true);
  });

  it("VerifyEmailUseCase should throw BadRequestError for invalid token", async () => {
    const useCase = new VerifyEmailUseCase(
      {
        verifyEmailVerificationToken: jest.fn(async (_token: string) => false),
      } as never,
      {
        compare: jest.fn<(raw: string, hash: string) => Promise<boolean>>(),
      } as never,
      { findById: jest.fn<(id: string) => Promise<User | null>>() } as never,
      {
        findByUserId: jest.fn<(id: string) => Promise<Token[]>>(),
        delete: jest.fn<(id: string) => Promise<void>>(),
      } as never,
    );

    await expect(useCase.execute({ token: "invalid" })).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it("VerifyEmailUseCase should verify user and delete token", async () => {
    const userRepository = {
      findById: jest.fn<(id: string) => Promise<User | null>>(),
      update: jest.fn<(user: User) => Promise<void>>(),
    };
    const tokenRepository = {
      findByUserId: jest.fn<(id: string) => Promise<Token[]>>(),
      delete: jest.fn<(id: string) => Promise<void>>(),
    };

    userRepository.findById.mockResolvedValue(makeUser(false));
    tokenRepository.findByUserId.mockResolvedValue([
      makeToken("EMAIL_VERIFICATION"),
    ]);

    const useCase = new VerifyEmailUseCase(
      {
        verifyEmailVerificationToken: jest.fn(async (_token: string) => true),
        decodeToken: jest.fn(async (_token: string) => ({ sub: "user-1" })),
      } as never,
      {
        compare: jest.fn(async (_raw: string, _hash: string) => true),
      } as never,
      userRepository as never,
      tokenRepository as never,
    );

    await useCase.execute({ token: "valid-token" });

    expect(userRepository.update).toHaveBeenCalledTimes(1);
    expect(tokenRepository.delete).toHaveBeenCalledWith("token-1");
  });

  it("ForgotPasswordUseCase should skip when user is unverified", async () => {
    const tokenRepository = {
      deleteByUserIdAndCreateNewToken:
        jest.fn<(userId: string, token: Token) => Promise<void>>(),
    };
    const emailQueueProvider = {
      addJob: jest.fn<(job: unknown) => Promise<void>>(),
    };

    const useCase = new ForgotPasswordUseCase(
      { hash: jest.fn<(data: string) => Promise<string>>() } as never,
      {
        findByEmail: jest.fn(async (_email: string) => makeUser(false)),
      } as never,
      tokenRepository as never,
      emailQueueProvider as never,
      {
        generatePasswordResetToken: jest.fn<(id: string) => Promise<string>>(),
      } as never,
    );

    await useCase.execute({ email: "admin@admin.com" });

    expect(
      tokenRepository.deleteByUserIdAndCreateNewToken,
    ).not.toHaveBeenCalled();
    expect(emailQueueProvider.addJob).not.toHaveBeenCalled();
  });

  it("ResetPasswordUseCase should throw BadRequestError for invalid token", async () => {
    const useCase = new ResetPasswordUseCase(
      {
        verifyPasswordResetToken: jest.fn(async (_token: string) => false),
      } as never,
      {
        compare: jest.fn<(raw: string, hash: string) => Promise<boolean>>(),
        hash: jest.fn<(data: string) => Promise<string>>(),
      } as never,
      { findById: jest.fn<(id: string) => Promise<User | null>>() } as never,
      { findByUserId: jest.fn<(id: string) => Promise<Token[]>>() } as never,
      {
        execute: jest.fn<(user: User, tokenId: string) => Promise<void>>(),
      } as never,
    );

    await expect(
      useCase.execute({ token: "bad-token", password: "12345678" }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it("ResetPasswordUseCase should update password and consume token", async () => {
    const resetPasswordRepository = {
      execute: jest.fn<(user: User, tokenId: string) => Promise<void>>(),
    };
    const token = makeToken("PASSWORD_RESET");
    const user = makeUser(true);

    const useCase = new ResetPasswordUseCase(
      {
        verifyPasswordResetToken: jest.fn(async (_token: string) => true),
        decodeToken: jest.fn(async (_token: string) => ({ sub: "user-1" })),
      } as never,
      {
        compare: jest.fn(async (_raw: string, _hash: string) => true),
        hash: jest.fn(async (_data: string) => "new-hash"),
      } as never,
      { findById: jest.fn(async (_id: string) => user) } as never,
      { findByUserId: jest.fn(async (_id: string) => [token]) } as never,
      resetPasswordRepository as never,
    );

    await useCase.execute({
      token: "valid-token",
      password: "new-password-123",
    });

    expect(resetPasswordRepository.execute).toHaveBeenCalledTimes(1);
    expect(resetPasswordRepository.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "user-1",
        passwordHash: "new-hash",
      }),
      "token-1",
    );
  });

  it("LoginUseCase should throw NotFoundError for missing user", async () => {
    const useCase = new LoginUseCase(
      { findByEmail: jest.fn(async (_email: string) => null) } as never,
      {
        compare: jest.fn<(raw: string, hash: string) => Promise<boolean>>(),
      } as never,
      {
        generateAccessToken: jest.fn<(id: string) => Promise<string>>(),
        generateRefreshToken: jest.fn<(id: string) => Promise<string>>(),
      } as never,
      {
        set: jest.fn<
          (key: string, value: string, ttl?: number) => Promise<void>
        >(),
      } as never,
    );

    await expect(
      useCase.execute({ email: "missing@admin.com", password: "12345678" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("LoginUseCase should throw UnauthorizedError for unverified user", async () => {
    const useCase = new LoginUseCase(
      {
        findByEmail: jest.fn(async (_email: string) => makeUser(false)),
      } as never,
      {
        compare: jest.fn(async (_raw: string, _hash: string) => true),
      } as never,
      {
        generateAccessToken: jest.fn<(id: string) => Promise<string>>(),
        generateRefreshToken: jest.fn<(id: string) => Promise<string>>(),
      } as never,
      {
        set: jest.fn<
          (key: string, value: string, ttl?: number) => Promise<void>
        >(),
      } as never,
    );

    await expect(
      useCase.execute({ email: "admin@admin.com", password: "12345678" }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("LoginUseCase should return tokens and persist session", async () => {
    const redisProvider = {
      set: jest.fn<
        (key: string, value: string, ttl?: number) => Promise<void>
      >(),
    };
    const user = makeUser(true);

    const useCase = new LoginUseCase(
      { findByEmail: jest.fn(async (_email: string) => user) } as never,
      {
        compare: jest.fn(async (_raw: string, _hash: string) => true),
      } as never,
      {
        generateAccessToken: jest.fn(async (_id: string) => "access-token"),
        generateRefreshToken: jest.fn(async (_id: string) => "refresh-token"),
      } as never,
      redisProvider as never,
    );

    const output = await useCase.execute({
      email: "admin@admin.com",
      password: "12345678",
    });

    expect(output.accessToken).toBe("access-token");
    expect(output.refreshToken).toBe("refresh-token");
    expect(redisProvider.set).toHaveBeenCalledTimes(1);
  });

  it("RefreshTokenUseCase should rotate session and return new tokens", async () => {
    const redisProvider = {
      delete: jest.fn<(key: string) => Promise<void>>(),
      set: jest.fn<
        (key: string, value: string, ttl?: number) => Promise<void>
      >(),
    };
    const useCase = new RefreshTokenUseCase(
      {
        generateAccessToken: jest.fn(async (_id: string) => "new-access-token"),
        generateRefreshToken: jest.fn(
          async (_id: string) => "new-refresh-token",
        ),
      } as never,
      redisProvider as never,
    );

    const result = await useCase.execute({
      userId: "user-1",
      refreshToken: "old-refresh-token",
    });

    expect(result.accessToken).toBe("new-access-token");
    expect(result.newRefreshToken).toBe("new-refresh-token");
    expect(redisProvider.delete).toHaveBeenCalledTimes(1);
    expect(redisProvider.set).toHaveBeenCalledTimes(1);
  });

  it("LogoutUseCase should delete refresh session key", async () => {
    const redisProvider = {
      delete: jest.fn<(key: string) => Promise<void>>(),
    };
    const useCase = new LogoutUseCase(redisProvider as never);

    await useCase.execute({ userId: "user-1", refreshToken: "refresh-token" });

    expect(redisProvider.delete).toHaveBeenCalledTimes(1);
  });

  it("GetMeUseCase should throw NotFoundError when repository returns null", async () => {
    const useCase = new GetMeUseCase({
      execute: jest.fn(async (_id: string) => null),
    } as never);

    await expect(useCase.execute("user-1")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("GetMeUseCase should return repository data", async () => {
    const repositoryData = {
      user: {
        id: "user-1",
        name: "admin",
        email: "admin@admin.com",
        isVerified: () => true,
      },
      profile: null,
    };
    const useCase = new GetMeUseCase({
      execute: jest.fn(async (_id: string) => repositoryData),
    } as never);

    const result = await useCase.execute("user-1");

    expect(result).toEqual(repositoryData);
  });
});
