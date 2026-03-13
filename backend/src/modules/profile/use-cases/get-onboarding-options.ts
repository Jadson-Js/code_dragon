import type {
  IGetOnboardingOptionsRepository,
  IOnboardingOptions,
} from "@/domain/database/repositories/profile/get-onboarding-options.repository";
import type { IRedisOnboardingOptionsRepository } from "@/domain/database/redis/onboarding-options.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetOnboardingOptionsUseCase {
  private readonly ttlSeconds = 24 * 60 * 60;

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

    await this.redisOnboardingOptionsRepository.set(options, this.ttlSeconds);

    return options;
  }
}
