import type { IOnboardingOptions } from "./profile/get-onboarding-options.repository";

export interface IRedisOnboardingOptionsRepository {
  get(): Promise<IOnboardingOptions | null>;
  set(value: IOnboardingOptions): Promise<void>;
  exists(): Promise<boolean>;
}
