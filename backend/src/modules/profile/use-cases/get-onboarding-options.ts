import { GetOnboardingOptionsPrismaRepository } from "@/infra/database/prisma/profile/get-onboarding-options.repository";
import { RedisOnboardingOptionsRepository } from "@/infra/database/redis/redis-onboarding-options.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetOnboardingOptionsUseCase {
  private readonly ttlSeconds = 24 * 60 * 60;

  constructor(
    private readonly getOnboardingOptionsRepository: GetOnboardingOptionsPrismaRepository,

    private readonly redisOnboardingOptionsRepository: RedisOnboardingOptionsRepository,
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
