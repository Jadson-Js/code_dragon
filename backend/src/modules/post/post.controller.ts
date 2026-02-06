import { postToHTTP } from "./post.presenter";
import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { CreatePostUseCase } from "./use-cases/create-post";
import type { FindAllPostUseCase } from "./use-cases/find-all-post";
import type { FindByIdPostUseCase } from "./use-cases/find-by-id-post";
import type { UpdatePostUseCase } from "./use-cases/update-post";
import type { DeletePostUseCase } from "./use-cases/delete-post";

@injectable()
export class PostController {
  constructor(
    @inject("CreatePostUseCase")
    private readonly createPostUseCase: CreatePostUseCase,

    @inject("FindAllPostUseCase")
    private readonly findAllPostUseCase: FindAllPostUseCase,

    @inject("FindByIdPostUseCase")
    private readonly findByIdPostUseCase: FindByIdPostUseCase,

    @inject("UpdatePostUseCase")
    private readonly updatePostUseCase: UpdatePostUseCase,

    @inject("DeletePostUseCase")
    private readonly deletePostUseCase: DeletePostUseCase,
  ) {}

  async create(request: Request, response: Response) {
    const body = request.body;
    const result = await this.createPostUseCase.execute(body);
    const httpResponse = postToHTTP(result);
    return response.status(201).json(httpResponse);
  }

  async findAll(request: Request, response: Response) {
    const result = await this.findAllPostUseCase.execute();
    const httpResponse = result.map(postToHTTP);
    return response.status(200).json(httpResponse);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;
    const result = await this.findByIdPostUseCase.execute(id as string);
    if (!result) return response.status(404).send();

    const httpResponse = postToHTTP(result);
    return response.status(200).json(httpResponse);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const body = request.body;
    const result = await this.updatePostUseCase.execute({ id, ...body });
    const httpResponse = postToHTTP(result);
    return response.status(200).json(httpResponse);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    await this.deletePostUseCase.execute(id as string);
    return response.status(204).send();
  }
}
