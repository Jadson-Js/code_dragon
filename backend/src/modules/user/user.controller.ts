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
    try {
      const { name, email, password } = request.body;

      const user = await this.createUserUseCase.execute({
        name,
        email,
        password,
      });

      const userResponse = userToHTTP(user);

      return response.status(201).json(userResponse);
    } catch (error) {
      console.error("Error creating user:", error);

      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }

      return response.status(500).json({ error: "Internal server error" });
    }
  }
}
