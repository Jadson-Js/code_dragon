import "reflect-metadata";
import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { AuthController } from "./auth.controller";

type ResponseMock = {
  status: jest.MockedFunction<(code: number) => ResponseMock>;
  json: jest.MockedFunction<(body?: unknown) => ResponseMock>;
  send: jest.MockedFunction<(body?: unknown) => ResponseMock>;
  cookie: jest.MockedFunction<
    (
      name: string,
      value: string,
      options?: Record<string, unknown>,
    ) => ResponseMock
  >;
  clearCookie: jest.MockedFunction<
    (name: string, options?: Record<string, unknown>) => ResponseMock
  >;
};

function makeResponse(): ResponseMock {
  const response = {} as ResponseMock;
  response.status = jest
    .fn<(code: number) => ResponseMock>()
    .mockReturnValue(response);
  response.json = jest
    .fn<(body?: unknown) => ResponseMock>()
    .mockReturnValue(response);
  response.send = jest
    .fn<(body?: unknown) => ResponseMock>()
    .mockReturnValue(response);
  response.cookie = jest
    .fn<
      (
        name: string,
        value: string,
        options?: Record<string, unknown>,
      ) => ResponseMock
    >()
    .mockReturnValue(response);
  response.clearCookie = jest
    .fn<(name: string, options?: Record<string, unknown>) => ResponseMock>()
    .mockReturnValue(response);
  return response;
}

function makeController() {
  const signupUseCase = {
    execute: jest.fn<(input: unknown) => Promise<unknown>>(),
  };
  const resendVerificationUseCase = {
    execute: jest.fn<(input: unknown) => Promise<unknown>>(),
  };
  const verifyEmailUseCase = {
    execute: jest.fn<(input: unknown) => Promise<unknown>>(),
  };
  const forgotPasswordUseCase = {
    execute: jest.fn<(input: unknown) => Promise<unknown>>(),
  };
  const resetPasswordUseCase = {
    execute: jest.fn<(input: unknown) => Promise<unknown>>(),
  };
  const loginUseCase = {
    execute: jest.fn<(input: unknown) => Promise<unknown>>(),
  };
  const logoutUseCase = {
    execute: jest.fn<(input: unknown) => Promise<unknown>>(),
  };
  const refreshTokenUseCase = {
    execute: jest.fn<(input: unknown) => Promise<unknown>>(),
  };
  const getMeUseCase = {
    execute: jest.fn<(input: unknown) => Promise<unknown>>(),
  };

  const controller = new AuthController(
    signupUseCase as never,
    resendVerificationUseCase as never,
    verifyEmailUseCase as never,
    forgotPasswordUseCase as never,
    resetPasswordUseCase as never,
    loginUseCase as never,
    logoutUseCase as never,
    refreshTokenUseCase as never,
    getMeUseCase as never,
  );

  return {
    controller,
    signupUseCase,
    resendVerificationUseCase,
    verifyEmailUseCase,
    forgotPasswordUseCase,
    resetPasswordUseCase,
    loginUseCase,
    logoutUseCase,
    refreshTokenUseCase,
    getMeUseCase,
  };
}

describe("AuthController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("signup should call use case and return 200", async () => {
    const { controller, signupUseCase } = makeController();
    const request = {
      body: { name: "admin", email: "m@admin.com", password: "12345678" },
    } as unknown as Request;
    const response = makeResponse();

    await controller.signup(request, response as unknown as Response);

    expect(signupUseCase.execute).toHaveBeenCalledWith(request.body);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      "If this email is not registered, you will receive a verification email.",
    );
  });

  it("resendVerification should call use case and return 200", async () => {
    const { controller, resendVerificationUseCase } = makeController();
    const request = { body: { email: "m@admin.com" } } as unknown as Request;
    const response = makeResponse();

    await controller.resendVerification(
      request,
      response as unknown as Response,
    );

    expect(resendVerificationUseCase.execute).toHaveBeenCalledWith(
      request.body,
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      "If this email is registered and not yet verified, you will receive a verification email.",
    );
  });

  it("verifyEmail should call use case and return 200", async () => {
    const { controller, verifyEmailUseCase } = makeController();
    const request = { body: { token: "token" } } as unknown as Request;
    const response = makeResponse();

    await controller.verifyEmail(request, response as unknown as Response);

    expect(verifyEmailUseCase.execute).toHaveBeenCalledWith(request.body);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      "This email has been verified successfully.",
    );
  });

  it("forgotPassword should call use case and return 200", async () => {
    const { controller, forgotPasswordUseCase } = makeController();
    const request = { body: { email: "m@admin.com" } } as unknown as Request;
    const response = makeResponse();

    await controller.forgotPassword(request, response as unknown as Response);

    expect(forgotPasswordUseCase.execute).toHaveBeenCalledWith(request.body);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      "If this email is registered and verified, you will receive a password reset email.",
    );
  });

  it("resetPassword should call use case and return 200", async () => {
    const { controller, resetPasswordUseCase } = makeController();
    const request = {
      body: { token: "token", password: "12345678" },
    } as unknown as Request;
    const response = makeResponse();

    await controller.resetPassword(request, response as unknown as Response);

    expect(resetPasswordUseCase.execute).toHaveBeenCalledWith(request.body);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith("Password reset successfully.");
  });

  it("login should set auth cookies and return user id", async () => {
    const { controller, loginUseCase } = makeController();
    loginUseCase.execute.mockResolvedValue({
      user: { id: "user-1" },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    const request = {
      body: { email: "m@admin.com", password: "12345678" },
    } as unknown as Request;
    const response = makeResponse();

    await controller.login(request, response as unknown as Response);

    expect(loginUseCase.execute).toHaveBeenCalledWith(request.body);
    expect(response.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "refresh-token",
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      }),
    );
    expect(response.cookie).toHaveBeenCalledWith(
      "accessToken",
      "access-token",
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      }),
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ id: "user-1" });
  });

  it("me should return authenticated user data", async () => {
    const { controller, getMeUseCase } = makeController();
    getMeUseCase.execute.mockResolvedValue({
      user: {
        id: "user-1",
        name: "admin",
        email: "m@admin.com",
        isVerified: () => true,
      },
      profile: { id: "profile-1" },
    });

    const request = { user: { id: "user-1" } } as unknown as Request;
    const response = makeResponse();

    await controller.me(request, response as unknown as Response);

    expect(getMeUseCase.execute).toHaveBeenCalledWith("user-1");
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      id: "user-1",
      name: "admin",
      email: "m@admin.com",
      isVerified: true,
      hasProfile: true,
    });
  });

  it("refreshToken should rotate auth cookies and return 200", async () => {
    const { controller, refreshTokenUseCase } = makeController();
    refreshTokenUseCase.execute.mockResolvedValue({
      accessToken: "new-access",
      newRefreshToken: "new-refresh",
    });

    const request = {
      user: { id: "user-1" },
      cookies: { refreshToken: "old-refresh" },
    } as unknown as Request;
    const response = makeResponse();

    await controller.refreshToken(request, response as unknown as Response);

    expect(refreshTokenUseCase.execute).toHaveBeenCalledWith({
      userId: "user-1",
      refreshToken: "old-refresh",
    });
    expect(response.cookie).toHaveBeenCalledTimes(2);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith();
  });

  it("logout should clear auth cookies and return 204", async () => {
    const { controller, logoutUseCase } = makeController();
    const request = {
      user: { id: "user-1" },
      cookies: { refreshToken: "refresh-token" },
    } as unknown as Request;
    const response = makeResponse();

    await controller.logout(request, response as unknown as Response);

    expect(logoutUseCase.execute).toHaveBeenCalledWith({
      userId: "user-1",
      refreshToken: "refresh-token",
    });
    expect(response.clearCookie).toHaveBeenCalledWith("accessToken");
    expect(response.clearCookie).toHaveBeenCalledWith("refreshToken");
    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.send).toHaveBeenCalledWith();
  });
});
