import type { User } from "@/domain/entities/user.entity";
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
    const { name, email, password } = request.body;

    const user = await this.createUserUseCase.execute({
      name,
      email,
      password,
    });

    const userResponse = userToHTTP(user);

    return response.status(201).json(userResponse);
  }
}
