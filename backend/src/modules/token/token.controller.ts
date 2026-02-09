import { tokenToHTTP } from "./token.presenter";
import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { FindAllTokenUseCase } from "./use-cases/find-all-token";
import type { FindByIdTokenUseCase } from "./use-cases/find-by-id-token";
import type { CreateTokenUseCase } from "./use-cases/create-token";
import type { UpdateTokenUseCase } from "./use-cases/update-token";
import type { DeleteTokenUseCase } from "./use-cases/delete-token";

@injectable()
export class TokenController {
  constructor(
    @inject("FindAllTokenUseCase")
    private readonly findAllTokenUseCase: FindAllTokenUseCase,

    @inject("FindByIdTokenUseCase")
    private readonly findByIdTokenUseCase: FindByIdTokenUseCase,

    @inject("CreateTokenUseCase")
    private readonly createTokenUseCase: CreateTokenUseCase,

    @inject("UpdateTokenUseCase")
    private readonly updateTokenUseCase: UpdateTokenUseCase,

    @inject("DeleteTokenUseCase")
    private readonly deleteTokenUseCase: DeleteTokenUseCase,
  ) {}

  async findAll(request: Request, response: Response) {
    const result = await this.findAllTokenUseCase.execute();
    const httpResponse = result.map(tokenToHTTP);
    return response.status(200).json(httpResponse);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;
    const result = await this.findByIdTokenUseCase.execute(id as string);
    if (!result) return response.status(404).send();

    const httpResponse = tokenToHTTP(result);
    return response.status(200).json(httpResponse);
  }

  async create(request: Request, response: Response) {
    const body = request.body;
    const result = await this.createTokenUseCase.execute(body);
    const httpResponse = tokenToHTTP(result);
    return response.status(201).json(httpResponse);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const body = request.body;
    const result = await this.updateTokenUseCase.execute({ id, ...body });
    const httpResponse = tokenToHTTP(result);
    return response.status(200).json(httpResponse);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    await this.deleteTokenUseCase.execute(id as string);
    return response.status(204).send();
  }
}
