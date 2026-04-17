import { injectable } from "tsyringe";
import { redisConnection } from "./connection";
import type { IOnboardingOptions } from "../prisma/profile/get-onboarding-options.repository";

export interface IRedisOnboardingOptionsRepository {
  get(): Promise<IOnboardingOptions | null>;
  set(value: IOnboardingOptions, ttlSeconds: number): Promise<void>;
  exists(): Promise<boolean>;
}

@injectable()
export class RedisOnboardingOptionsRepository implements IRedisOnboardingOptionsRepository {
  async get(): Promise<IOnboardingOptions | null> {
    const value = await redisConnection.get("onboarding-options");
    return value ? JSON.parse(value) : null;
  }

  async set(value: IOnboardingOptions, ttlSeconds: number): Promise<void> {
    await redisConnection.setex(
      "onboarding-options",
      ttlSeconds,
      JSON.stringify(value),
    );
  }

  async exists(): Promise<boolean> {
    const result = await redisConnection.exists("onboarding-options");
    return result === 1;
  }
}
