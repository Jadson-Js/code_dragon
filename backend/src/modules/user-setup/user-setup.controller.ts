import { userSetupToHTTP } from "./user-setup.presenter";
import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { CreateUserSetupUseCase } from "./use-cases/create-user-setup";

@injectable()
export class UserSetupController {
  constructor(
    @inject("CreateUserSetupUseCase")
    private readonly createUserSetupUseCase: CreateUserSetupUseCase,
  ) {}

  async create(request: Request, response: Response) {
    const body = request.body;
    const userId = request.user.id;

    const result = await this.createUserSetupUseCase.execute({
      ...body,
      userId,
    });
    const httpResponse = userSetupToHTTP(result);
    return response.status(201).json(httpResponse);
  }
}
