import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { User } from "@/entities/user.entity";
import { Token } from "@/entities/token.entity";
import { BadRequestError, NotFoundError } from "@/shared/app.error";
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

      expect(createUserWithEmailTokenRepository.execute).toHaveBeenCalledTimes(
        1,
      );
      expect(emailQueueProvider.addJob).toHaveBeenCalledTimes(1);
    });
  });

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

  describe("LogoutUseCase", () => {
    it("should delete refresh session key", async () => {
      const redisProvider = { delete: jest.fn<any>() };
      const useCase = new LogoutUseCase(redisProvider as never);

      await useCase.execute({
        userId: "user-1",
        refreshToken: "refresh-token",
      });

      expect(redisProvider.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe("RefreshTokenUseCase", () => {
    it("should rotate session and return new tokens", async () => {
      const redisProvider = { delete: jest.fn<any>(), set: jest.fn<any>() };
      const useCase = new RefreshTokenUseCase(
        {
          generateAccessToken: jest.fn(async () => "new-access"),
          generateRefreshToken: jest.fn(async () => "new-refresh"),
        } as never,
        redisProvider as never,
      );

      const result = await useCase.execute({
        userId: "user-1",
        refreshToken: "old",
      });

      expect(result.accessToken).toBe("new-access");
      expect(result.newRefreshToken).toBe("new-refresh");
      expect(redisProvider.delete).toHaveBeenCalledTimes(1);
      expect(redisProvider.set).toHaveBeenCalledTimes(1);
    });
  });

  describe("GetMeUseCase", () => {
    it("should throw NotFoundError when repository returns null", async () => {
      const useCase = new GetMeUseCase({
        execute: jest.fn(async () => null),
      } as never);
      await expect(useCase.execute("user-1")).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it("should return repository data", async () => {
      const data = {
        user: { id: "user-1", isVerified: () => true },
        profile: null,
      };
      const useCase = new GetMeUseCase({
        execute: jest.fn(async () => data),
      } as never);
      const result = await useCase.execute("user-1");
      expect(result).toEqual(data);
    });
  });
});
