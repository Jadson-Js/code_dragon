import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { SignupAuthUseCase } from "./use-cases/signup-auth";
import type { ResendEmailUseCase } from "./use-cases/resend-email";
import type { VerifyEmailUseCase } from "./use-cases/verify-email";
import type { ForgotPasswordUseCase } from "./use-cases/forgot-password";
import { authToHTTP } from "./auth.presenter";

@injectable()
export class AuthController {
  constructor(
    @inject("SignupAuthUseCase")
    private readonly signupAuthUseCase: SignupAuthUseCase,

    @inject("ResendEmailUseCase")
    private readonly resendEmailUseCase: ResendEmailUseCase,

    @inject("VerifyEmailUseCase")
    private readonly verifyEmailUseCase: VerifyEmailUseCase,

    @inject("ForgotPasswordUseCase")
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
  ) {}

  async signup(request: Request, response: Response) {
    const result = await this.signupAuthUseCase.execute(request.body);
    return response.status(200).json(result);
  }

  async resendEmail(request: Request, response: Response) {
    const result = await this.resendEmailUseCase.execute(request.body);
    return response.status(200).json(result);
  }

  async verifyEmail(request: Request, response: Response) {
    const url = await this.verifyEmailUseCase.execute(request.body);
    return response.redirect(url);
  }

  async forgotPassword(request: Request, response: Response) {
    const result = await this.forgotPasswordUseCase.execute(request.body);
    return response.status(200).json(result);
  }
}
