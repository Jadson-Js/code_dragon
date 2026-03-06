import { userSetupToHTTP } from "./user-setup.presenter";
import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { FindAllUserSetupUseCase } from "./use-cases/find-all-user-setup";
import type { FindByIdUserSetupUseCase } from "./use-cases/find-by-id-user-setup";
import type { CreateUserSetupUseCase } from "./use-cases/create-user-setup";
import type { UpdateUserSetupUseCase } from "./use-cases/update-user-setup";
import type { DeleteUserSetupUseCase } from "./use-cases/delete-user-setup";

@injectable()
export class UserSetupController {
  constructor(
    @inject("FindAllUserSetupUseCase")
    private readonly findAllUserSetupUseCase: FindAllUserSetupUseCase,

    @inject("FindByIdUserSetupUseCase")
    private readonly findByIdUserSetupUseCase: FindByIdUserSetupUseCase,

    @inject("CreateUserSetupUseCase")
    private readonly createUserSetupUseCase: CreateUserSetupUseCase,

    @inject("UpdateUserSetupUseCase")
    private readonly updateUserSetupUseCase: UpdateUserSetupUseCase,

    @inject("DeleteUserSetupUseCase")
    private readonly deleteUserSetupUseCase: DeleteUserSetupUseCase,
  ) {}

  async findAll(request: Request, response: Response) {
    const result = await this.findAllUserSetupUseCase.execute();
    const httpResponse = result.map(userSetupToHTTP);
    return response.status(200).json(httpResponse);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;
    const result = await this.findByIdUserSetupUseCase.execute(id as string);
    if (!result) return response.status(404).send();

    const httpResponse = userSetupToHTTP(result);
    return response.status(200).json(httpResponse);
  }

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

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const body = request.body;
    const result = await this.updateUserSetupUseCase.execute({ id, ...body });
    const httpResponse = userSetupToHTTP(result);
    return response.status(200).json(httpResponse);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    await this.deleteUserSetupUseCase.execute(id as string);
    return response.status(204).send();
  }
}
