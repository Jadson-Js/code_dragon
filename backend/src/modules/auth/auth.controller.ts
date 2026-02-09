import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { SignupAuthUseCase } from "./use-cases/signup-auth";
import type { ResendEmailUseCase } from "./use-cases/resend-email";
import { authToHTTP } from "./auth.presenter";

@injectable()
export class AuthController {
  constructor(
    @inject("SignupAuthUseCase")
    private readonly signupAuthUseCase: SignupAuthUseCase,

    @inject("ResendEmailUseCase")
    private readonly resendEmailUseCase: ResendEmailUseCase,
  ) {}

  async signup(request: Request, response: Response) {
    const result = await this.signupAuthUseCase.execute(request.body);
    const httpResponse = authToHTTP(result);
    return response.status(201).json(httpResponse);
  }

  async resendEmail(request: Request, response: Response) {
    const result = await this.resendEmailUseCase.execute(request.body);
    return response.status(200).json(result);
  }
}
