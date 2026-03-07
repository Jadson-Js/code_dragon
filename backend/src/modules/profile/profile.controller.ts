import { profileToHTTP } from "./profile.presenter";
import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { CreateProfileUseCase } from "./use-cases/create-profile";

@injectable()
export class ProfileController {
  constructor(
    @inject("CreateProfileUseCase")
    private readonly createProfileUseCase: CreateProfileUseCase,
  ) {}

  async create(request: Request, response: Response) {
    const body = request.body;
    const userId = request.user.id;

    const result = await this.createProfileUseCase.execute({
      ...body,
      userId,
    });
    const httpResponse = profileToHTTP(result);
    return response.status(201).json(httpResponse);
  }
}
