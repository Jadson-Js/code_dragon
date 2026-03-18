import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { CreateProfileUseCase } from "./use-cases/create-profile";
import type { GetOnboardingOptionsUseCase } from "./use-cases/get-onboarding-options";
import type { GetProfileByUserIdUseCase } from "./use-cases/get-profile-by-user-id";
import type {
  IGetOnboardingOptionsOutputDTO,
  ICreateProfileOutputDTO,
  IGetProfileByUserIdOutputDTO,
} from "./profile.dto";

@injectable()
export class ProfileController {
  constructor(
    @inject("CreateProfileUseCase")
    private readonly createProfileUseCase: CreateProfileUseCase,

    @inject("GetOnboardingOptionsUseCase")
    private readonly getOnboardingOptionsUseCase: GetOnboardingOptionsUseCase,

    @inject("GetProfileByUserIdUseCase")
    private readonly getProfileByUserIdUseCase: GetProfileByUserIdUseCase,
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

  async getMe(
    request: Request,
    response: Response,
  ): Promise<Response<IGetProfileByUserIdOutputDTO>> {
    const userId = request.user.id;

    const result = await this.getProfileByUserIdUseCase.execute(userId);

    return response.status(200).json(result);
  }
}
