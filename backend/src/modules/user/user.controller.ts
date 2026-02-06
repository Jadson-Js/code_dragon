import { userToHTTP } from "./user.presenter";
import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { FindAllUserUseCase } from "./use-cases/find-all-user";
import type { FindByIdUserUseCase } from "./use-cases/find-by-id-user";
import type { CreateUserUseCase } from "./use-cases/create-user";
import type { UpdateUserUseCase } from "./use-cases/update-user";
import type { DeleteUserUseCase } from "./use-cases/delete-user";

@injectable()
export class UserController {
  constructor(
    @inject("FindAllUserUseCase")
    private readonly findAllUserUseCase: FindAllUserUseCase,

    @inject("FindByIdUserUseCase")
    private readonly findByIdUserUseCase: FindByIdUserUseCase,

    @inject("CreateUserUseCase")
    private readonly createUserUseCase: CreateUserUseCase,

    @inject("UpdateUserUseCase")
    private readonly updateUserUseCase: UpdateUserUseCase,

    @inject("DeleteUserUseCase")
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  async findAll(request: Request, response: Response) {
    const result = await this.findAllUserUseCase.execute();
    const httpResponse = result.map(userToHTTP);
    return response.status(200).json(httpResponse);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;
    const result = await this.findByIdUserUseCase.execute(id as string);
    if (!result) return response.status(404).send();

    const httpResponse = userToHTTP(result);
    return response.status(200).json(httpResponse);
  }

  async create(request: Request, response: Response) {
    const body = request.body;
    const result = await this.createUserUseCase.execute(body);
    const httpResponse = userToHTTP(result);
    return response.status(201).json(httpResponse);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const body = request.body;
    const result = await this.updateUserUseCase.execute({ id, ...body });
    const httpResponse = userToHTTP(result);
    return response.status(200).json(httpResponse);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    await this.deleteUserUseCase.execute(id as string);
    return response.status(204).send();
  }
}
