import type { Request, Response } from "express";
import { injectable } from "tsyringe";
import { CreateProfileUseCase } from "./use-cases/create-profile";
import { GetOnboardingOptionsUseCase } from "./use-cases/get-onboarding-options";
import { GetProfileByUserIdUseCase } from "./use-cases/get-profile-by-user-id";

@injectable()
export class ProfileController {
  constructor(
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly getOnboardingOptionsUseCase: GetOnboardingOptionsUseCase,
    private readonly getProfileByUserIdUseCase: GetProfileByUserIdUseCase,
  ) {}

  async create(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const body = request.body;
    const userId = request.user.id;

    const result = await this.createProfileUseCase.execute({
      ...body,
      userId,
    });

    const httpResponse = { id: result.id };
    return response.status(201).json(httpResponse);
  }

  async getOnboardingOptions(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const result = await this.getOnboardingOptionsUseCase.execute();

    return response.status(200).json(result);
  }

  async getMe(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const userId = request.user.id;

    const result = await this.getProfileByUserIdUseCase.execute(userId);

    return response.status(200).json(result);
  }
}
