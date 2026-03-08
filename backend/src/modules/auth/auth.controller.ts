import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { SignupUseCase } from "./use-cases/signup";
import type { ResendVerificationUseCase } from "./use-cases/resend-verification";
import type { VerifyEmailUseCase } from "./use-cases/verify-email";
import type { ForgotPasswordUseCase } from "./use-cases/forgot-password";
import type { ResetPasswordUseCase } from "./use-cases/reset-password";
import { authToHTTP, getMeToHTTP } from "./auth.presenter";
import type { LoginUseCase } from "./use-cases/login";
import type { LogoutUseCase } from "./use-cases/logout";
import type { RefreshTokenUseCase } from "./use-cases/refresh-token";
import { env } from "@/shared/env";
import type { GetMeUseCase } from "./use-cases/get-me";

@injectable()
export class AuthController {
  constructor(
    @inject("SignupUseCase")
    private readonly signupUseCase: SignupUseCase,

    @inject("ResendVerificationUseCase")
    private readonly resendVerificationUseCase: ResendVerificationUseCase,

    @inject("VerifyEmailUseCase")
    private readonly verifyEmailUseCase: VerifyEmailUseCase,

    @inject("ForgotPasswordUseCase")
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,

    @inject("ResetPasswordUseCase")
    private readonly resetPasswordUseCase: ResetPasswordUseCase,

    @inject("LoginUseCase")
    private readonly loginUseCase: LoginUseCase,

    @inject("LogoutUseCase")
    private readonly logoutUseCase: LogoutUseCase,

    @inject("RefreshTokenUseCase")
    private readonly refreshTokenUseCase: RefreshTokenUseCase,

    @inject("GetMeUseCase")
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  async me(request: Request, response: Response) {
    const userId = request.user.id;
    const result = await this.getMeUseCase.execute(userId);

    return response.status(200).json(getMeToHTTP(result));
  }

  async signup(request: Request, response: Response) {
    await this.signupUseCase.execute(request.body);
    return response
      .status(200)
      .json(
        "If this email is not registered, you will receive a verification email.",
      );
  }

  async resendVerification(request: Request, response: Response) {
    await this.resendVerificationUseCase.execute(request.body);
    return response
      .status(200)
      .json(
        "If this email is registered and not yet verified, you will receive a verification email.",
      );
  }

  async verifyEmail(request: Request, response: Response) {
    await this.verifyEmailUseCase.execute(request.body);
    return response
      .status(200)
      .json("This email has been verified successfully.");
  }

  async forgotPassword(request: Request, response: Response) {
    await this.forgotPasswordUseCase.execute(request.body);
    return response
      .status(200)
      .json(
        "If this email is registered and verified, you will receive a password reset email.",
      );
  }

  async resetPassword(request: Request, response: Response) {
    await this.resetPasswordUseCase.execute(request.body);
    return response.status(200).json("Password reset successfully.");
  }

  async login(request: Request, response: Response) {
    const { user, accessToken, refreshToken } = await this.loginUseCase.execute(
      request.body,
    );

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: env.jwtRefreshExpiresInMs,
    });

    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: env.jwtAccessExpiresInMs,
    });

    return response.status(200).json(authToHTTP(user));
  }

  async refreshToken(request: Request, response: Response) {
    const refreshToken = request.cookies.refreshToken;
    const userId = request.user.id;

    const { accessToken, newRefreshToken } =
      await this.refreshTokenUseCase.execute({
        userId,
        refreshToken,
      });

    response.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: env.jwtRefreshExpiresInMs,
    });

    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: env.jwtAccessExpiresInMs,
    });

    return response.status(200).send();
  }

  async logout(request: Request, response: Response) {
    const userId = request.user.id;
    const refreshToken = request.cookies.refreshToken;

    await this.logoutUseCase.execute({ userId, refreshToken });

    response.clearCookie("accessToken");
    response.clearCookie("refreshToken");

    return response.status(204).send();
  }
}
