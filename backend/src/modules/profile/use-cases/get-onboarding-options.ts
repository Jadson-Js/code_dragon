import type {
  IGetOnboardingOptionsRepository,
  IOnboardingOptions,
} from "@/domain/repositories/profile/get-onboarding-options.repository";
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
      if (response) return response;
    }

    const options = await this.getOnboardingOptionsRepository.execute();

    await this.redisOnboardingOptionsRepository.set(options);

    return options;
  }
}
