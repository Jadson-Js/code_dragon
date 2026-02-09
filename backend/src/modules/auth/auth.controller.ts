import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { SignupAuthUseCase } from "./use-cases/signup-auth";
import { authToHTTP } from "./auth.presenter";

@injectable()
export class AuthController {
  constructor(
    @inject("SignupAuthUseCase")
    private readonly signupAuthUseCase: SignupAuthUseCase,
  ) {}

  async signup(request: Request, response: Response) {
    const result = await this.signupAuthUseCase.execute(request.body);
    const httpResponse = authToHTTP(result);
    return response.status(201).json(httpResponse);
  }
}
