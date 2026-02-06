import type { CreateUserUseCase } from "./use-cases/create-user";
import { userToHTTP } from "./user.presenter";
import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserController {
  constructor(
    @inject("CreateUserUseCase")
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async create(request: Request, response: Response) {
    const { name, email, passwordHash } = request.body;

    const user = await this.createUserUseCase.execute({
      name,
      email,
      passwordHash,
    });

    const userResponse = userToHTTP(user);

    return response.status(201).json(userResponse);
  }
}
