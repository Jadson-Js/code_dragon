import type { IGetOnboardingOptionsRepository } from "@/domain/repositories/profile/get-onboarding-options.repository";
import type { IRedisOnboardingOptionsRepository } from "@/domain/repositories/redis-onboarding-options.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetOnboardingOptionsUseCase {
  constructor(
    @inject("getOnboardingOptionsRepository")
    private readonly getOnboardingOptionsRepository: IGetOnboardingOptionsRepository,

    @inject("redisOnboardingOptionsRepository")
    private readonly redisOnboardingOptionsRepository: IRedisOnboardingOptionsRepository,
  ) {}

  async execute() {
    const exists = await this.redisOnboardingOptionsRepository.exists();

    if (exists) {
      const response = await this.redisOnboardingOptionsRepository.get();
      return response;
    }

    const response = await this.getOnboardingOptionsRepository.execute();
    await this.redisOnboardingOptionsRepository.set(response);

    return response;
  }
}
