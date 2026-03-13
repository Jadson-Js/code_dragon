import { injectable } from "tsyringe";
import type { IRedisOnboardingOptionsRepository } from "@/domain/repositories/redis-onboarding-options.repository";
import { redisConnection } from "./connection";
import type { IGetOnboardingOptionsOutputDTO } from "@/modules/profile/profile.dto";

@injectable()
export class RedisOnboardingOptionsRepository implements IRedisOnboardingOptionsRepository {
  async get(): Promise<IGetOnboardingOptionsOutputDTO | null> {
    const value = await redisConnection.get("onboarding-options");
    return value ? JSON.parse(value) : null;
  }

  async set(value: IGetOnboardingOptionsOutputDTO): Promise<void> {
    await redisConnection.set("onboarding-options", JSON.stringify(value));
  }

  async exists(): Promise<boolean> {
    const result = await redisConnection.exists("onboarding-options");
    return result === 1;
  }
}
