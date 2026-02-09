import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { SignupAuthUseCase } from "./use-cases/signup-auth";
import type { ResendEmailUseCase } from "./use-cases/resend-email";
import type { VerifyEmailUseCase } from "./use-cases/verify-email";
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
  ) {}

  async signup(request: Request, response: Response) {
    const result = await this.signupAuthUseCase.execute(request.body);
    // Always return 200 with generic message to prevent email enumeration
    return response.status(200).json(result);
  }

  async resendEmail(request: Request, response: Response) {
    const result = await this.resendEmailUseCase.execute(request.body);
    return response.status(200).json(result);
  }

  async verifyEmail(request: Request, response: Response) {
    const { redirectUrl } = await this.verifyEmailUseCase.execute(request.body);
    return response.redirect(redirectUrl);
  }
}
