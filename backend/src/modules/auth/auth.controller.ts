import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { SignupUseCase } from "./use-cases/signup";
import type { ResendVerificationUseCase } from "./use-cases/resend-verification";
import type { VerifyEmailUseCase } from "./use-cases/verify-email";
import type { ForgotPasswordUseCase } from "./use-cases/forgot-password";
import type { ResetPasswordUseCase } from "./use-cases/reset-password";
import { authToHTTP } from "./auth.presenter";
import type { LoginUseCase } from "./use-cases/login";
import { env } from "@/shared/env";

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
  ) {}

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
}
