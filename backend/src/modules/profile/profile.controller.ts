import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { CreateProfileUseCase } from "./use-cases/create-profile";
import type { GetOnboardingOptionsUseCase } from "./use-cases/get-onboarding-options";
import type {
  IGetOnboardingOptionsOutputDTO,
  ICreateProfileOutputDTO,
} from "./profile.dto";

@injectable()
export class ProfileController {
  constructor(
    @inject("CreateProfileUseCase")
    private readonly createProfileUseCase: CreateProfileUseCase,

    @inject("GetOnboardingOptionsUseCase")
    private readonly getOnboardingOptionsUseCase: GetOnboardingOptionsUseCase,
  ) {}

  async create(
    request: Request,
    response: Response,
  ): Promise<Response<ICreateProfileOutputDTO>> {
    const body = request.body;
    const userId = request.user.id;

    const result = await this.createProfileUseCase.execute({
      ...body,
      userId,
    });

    const httpResponse: ICreateProfileOutputDTO = { id: result.id };
    return response.status(201).json(httpResponse);
  }

  async getOnboardingOptions(
    request: Request,
    response: Response,
  ): Promise<Response<IGetOnboardingOptionsOutputDTO>> {
    const result = await this.getOnboardingOptionsUseCase.execute();

    return response.status(200).json(result);
  }
}
