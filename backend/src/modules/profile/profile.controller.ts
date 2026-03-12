import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { CreateProfileUseCase } from "./use-cases/create-profile";
import type { GetSetupUseCase } from "./use-cases/get-setup";
import type { IGetSetupDTO } from "./profile.dto";

@injectable()
export class ProfileController {
  constructor(
    @inject("CreateProfileUseCase")
    private readonly createProfileUseCase: CreateProfileUseCase,

    @inject("GetSetupUseCase")
    private readonly getSetupUseCase: GetSetupUseCase,
  ) {}

  async create(request: Request, response: Response) {
    const body = request.body;
    const userId = request.user.id;

    const result = await this.createProfileUseCase.execute({
      ...body,
      userId,
    });

    return response.status(201).json({ id: result.id });
  }

  async getSetup(request: Request, response: Response): Promise<Response> {
    const result = await this.getSetupUseCase.execute();

    return response.status(200).json(result);
  }
}
