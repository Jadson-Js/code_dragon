import type { CreateUserUseCase } from "./use-cases/create-user";
import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserController {
  constructor(
    @inject("CreateUserUseCase")
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async create(request: Request, response: Response) {
    try {
      const { name, email, password, birthDate } = request.body;

      const user = await this.createUserUseCase.execute({
        name,
        email,
        password,
        birthDate,
      });

      return response.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);

      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }

      return response.status(500).json({ error: "Internal server error" });
    }
  }
}
