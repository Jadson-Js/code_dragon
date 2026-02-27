import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { SignupAuthUseCase } from "./use-cases/signup-auth";
import type { ResendEmailUseCase } from "./use-cases/resend-email";
import type { VerifyEmailUseCase } from "./use-cases/verify-email";
import type { ForgotPasswordUseCase } from "./use-cases/forgot-password";
import type { ResetPasswordUseCase } from "./use-cases/reset-password";
import { env } from "@/shared/env";

@injectable()
export class AuthController {
  private readonly SIGNUP_RESPONSE = {
    message:
      "If this email is not registered, you will receive a verification email.",
  };

  private readonly RESEND_EMAIL_RESPONSE = {
    message:
      "If this email is registered and not yet verified, you will receive a verification email.",
  };

  private readonly VERIFY_EMAIL_RESPONSE = {
    message: "This email has been verified successfully.",
  };

  private readonly FORGOT_PASSWORD_RESPONSE = {
    message:
      "If this email is registered and verified, you will receive a password reset email.",
  };

  private readonly RESET_PASSWORD_RESPONSE = {
    message: "Password reset successfully.",
  };

  constructor(
    @inject("SignupAuthUseCase")
    private readonly signupAuthUseCase: SignupAuthUseCase,

    @inject("ResendEmailUseCase")
    private readonly resendEmailUseCase: ResendEmailUseCase,

    @inject("VerifyEmailUseCase")
    private readonly verifyEmailUseCase: VerifyEmailUseCase,

    @inject("ForgotPasswordUseCase")
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,

    @inject("ResetPasswordUseCase")
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  async signup(request: Request, response: Response) {
    await this.signupAuthUseCase.execute(request.body);
    return response.status(200).json(this.SIGNUP_RESPONSE);
  }

  async resendEmail(request: Request, response: Response) {
    await this.resendEmailUseCase.execute(request.body);
    return response.status(200).json(this.RESEND_EMAIL_RESPONSE);
  }

  async verifyEmail(request: Request, response: Response) {
    await this.verifyEmailUseCase.execute(request.body);
    return response.status(200).json(this.VERIFY_EMAIL_RESPONSE);
  }

  async forgotPassword(request: Request, response: Response) {
    await this.forgotPasswordUseCase.execute(request.body);
    return response.status(200).json(this.FORGOT_PASSWORD_RESPONSE);
  }

  async resetPassword(request: Request, response: Response) {
    await this.resetPasswordUseCase.execute(request.body);
    return response.status(200).json(this.RESET_PASSWORD_RESPONSE);
  }
}
